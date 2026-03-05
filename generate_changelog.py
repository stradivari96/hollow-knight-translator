import json
import subprocess
from pathlib import Path

# The file lived at multiple paths across git history in hollow-knight-translator
PATHS = [
    "src/all_text.json",
    "src/pages/all_text.json",
    "docs/all_text.json",
    "front/src/pages/all_text.json"
]


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8")


def get_commits():
    """Return all commits that touched any of the paths, newest first."""
    seen = {}
    for path in PATHS:
        result = run(["git", "log", "--format=%H|%ai|%s", "--", path])
        for line in result.stdout.strip().splitlines():
            if not line:
                continue
            h, date, msg = line.split("|", 2)
            if h not in seen:
                seen[h] = {"hash": h, "date": date[:10], "message": msg}
    return sorted(seen.values(), key=lambda c: c["date"], reverse=True)


def get_json_at(commit_hash):
    """Try all file paths for a given commit and return parsed JSON."""
    for path in PATHS:
        result = run(["git", "show", f"{commit_hash}:{path}"])
        if result.returncode == 0:
            try:
                return json.loads(result.stdout)
            except json.JSONDecodeError:
                continue
    return None


def diff(old, new):
    """Return structured list of changes between two all_text.json objects."""
    changes = []
    all_langs = sorted(set(old) | set(new))
    for lang in all_langs:
        old_lang = old.get(lang, {})
        new_lang = new.get(lang, {})
        all_keys = sorted(set(old_lang) | set(new_lang))
        for key in all_keys:
            ov, nv = old_lang.get(key), new_lang.get(key)
            if ov is None and nv is not None:
                changes.append({"key": key, "lang": lang, "type": "added", "new": nv})
            elif ov is not None and nv is None:
                changes.append({"key": key, "lang": lang, "type": "removed", "old": ov})
            elif ov != nv:
                changes.append({"key": key, "lang": lang, "type": "modified", "old": ov, "new": nv})
    return changes


if __name__ == "__main__":
    commits = get_commits()
    print(f"Found {len(commits)} commits touching all_text.json")

    changelog = []
    for i, commit in enumerate(commits[:-1]):
        newer = commit
        older = commits[i + 1]
        new_data = get_json_at(newer["hash"])
        old_data = get_json_at(older["hash"])
        if new_data is None or old_data is None:
            print(f"  Skipping {newer['hash'][:7]} (could not load file)")
            continue
        changes = diff(old_data, new_data)
        if changes:
            changelog.append({
                "commit": newer["hash"][:7],
                "date": newer["date"],
                "message": newer["message"],
                "changes": changes,
            })
            print(f"  {newer['hash'][:7]} {newer['message']}: {len(changes)} changes")
        else:
            print(f"  {newer['hash'][:7]} {newer['message']}: no text changes")

    out = Path("src/changelog.json")
    out.write_text(json.dumps(changelog, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(e["changes"]) for e in changelog)
    print(f"\nWrote {out} — {len(changelog)} versions, {total} total changes")

import base64
from pathlib import Path
from Crypto.Cipher import AES

KEY = b'UKu52ePUBwetZ9wNX88o54dnfKRu0T1l'


def decrypt_file(data: bytes) -> bytes:
    raw = base64.b64decode(data.strip())
    cipher = AES.new(KEY, AES.MODE_ECB)
    decrypted = cipher.decrypt(raw)
    pad_len = decrypted[-1]
    if 1 <= pad_len <= 16:
        decrypted = decrypted[:-pad_len]
    return decrypted


if __name__ == "__main__":
    input_dir = Path("TextAsset")
    output_dir = Path("DecodedText")
    output_dir.mkdir(exist_ok=True)

    for path in sorted(input_dir.glob("*.txt")):
        try:
            result = decrypt_file(path.read_bytes())
            (output_dir / path.name).write_bytes(result)
            print(f"Decrypted: {path.name}")
        except Exception as e:
            print(f"Failed: {path.name}: {e}")

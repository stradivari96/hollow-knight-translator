# hollow-knight-translator

Search text assets based on its name.

## Website development

```
npm start
```


## Exporting assets

```
Remove-Item -Path ".\TextAsset\*.txt"
Remove-Item -Path ".\DecodedText\*.txt"
```

Export all `TextAsset` using https://github.com/Perfare/AssetStudio. And run:

Run the following command to decrypt text assets and generate JSON files.
```
python decrypt_textassets.py
```

```
python generate_json.py
python generate_changelog.py
```

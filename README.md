# sivabayyavarapu.github.io

This repository hosts the personal website for Siva Bayyavarapu. The site is a simple static site served via GitHub Pages from the `main` branch.

## How to edit

- Update `index.html` to change content.
- Edit `assets/styles.css` to customize styling.

## Recommended branch workflow

Use `work` as your feature branch and open a pull request into `main`.

```bash
git checkout work
git pull --rebase origin work
git add .
git commit -m "Update site"
git push -u origin work
```

Then create a PR from `work` -> `main`, review, and merge.

## Publish changes directly (without PR)

```bash
git add .
git commit -m "Update site"
git push origin main
```

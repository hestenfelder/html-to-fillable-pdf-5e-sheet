# HTML to Fillable PDF 5e Character-Sheet
**Note: This project is not and never will be "production-ready". The export format is currently hardcoded to A4 landscape, css rules could use clean-up, and so on. I've decided to share this for those that are interested in creating FILLABLE forms from pure HTML/CSS with the help of LaTeX.**

This is an attempt to create a (very slim) fillable pdf character sheet from html by
- having a printable page layout through css media queries (just press Ctrl+P),
- creating LaTeX sourcecode capable of creating fillable forms (using the `eforms` and `insdljs` packages)
- and creating a LaTeX representation of html elements (marked as fields) to create a fillable PDF form document to be used for your D&D 5e character.

![html-to-fillable-pdf-webview-example](https://user-images.githubusercontent.com/37473190/120380383-64f44800-c321-11eb-882a-4e66e71b6f80.png)

# Requirements
Two things:
- A LaTeX editor and a TeX distribution (like https://miktex.org)
- A server capable of running a pure html/css/js website.
- A bit of knowledge in html/css/js if you want to make edits.

# How do I use it?
- Serve the page (e.g. run `python -m http.server 7001` in the folder with `index.html`),
- open the webpage (`localhost:7001` for this example),
- press the "Create LaTeX" button and select the page range ("1" for this example),
- hit Ctrl+P, select "Save as PDF" (landscape, A4, no margin) and save as `base.pdf` next to the .tex file,
- Open the LaTeX source file and compile it.

You should now have a fillable PDF form, based on pure HTML and CSS (using LaTeX as a bridge though).

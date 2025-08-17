const n=`---
title: "The Markdown Reference Guide"
slug: "MarkdownTutorial"
date: "2024-07-27"
category: "Guides"
readTime: "8 min read"
excerpt: "A comprehensive markdown reference guide with both raw code and rendered examples. Partially generated with ChatGPT"
---

Markdown is a lightweight markup language for formatting text like you see on this page. This guide shows every major Markdown feature, with both the raw code and the rendered result, so you can see exactly how to use each one.

---

## 📚 Table of Contents

1. [Headers](#headers)
2. [Text Styles](#text-styles)
3. [Line Breaks](#line-breaks)
4. [Blockquotes](#blockquotes)
5. [Lists](#lists)
6. [Links](#links)
7. [Images](#images)
8. [Code](#code)
9. [Horizontal Rules](#horizontal-rules)
10. [Tables](#tables)
11. [Task Lists](#task-lists)
12. [Mentions & Tags](#mentions--tags)
13. [Collapsible Sections](#collapsible-sections)
14. [HTML in Markdown](#html-in-markdown)
15. [Escaping Characters](#escaping-characters)
16. [Footnotes](#footnotes)
17. [Emojis](#emojis)
18. [Math (LaTeX)](#math-latex)
19. [End](#end)

---

## Headers

**Raw:**
\`\`\`markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
\`\`\`

**Rendered:**

# H1
## H2
### H3
#### H4
##### H5
###### H6

---

## Text Styles

**Raw:**
\`\`\`markdown
*Italic* or _Italic_
**Bold** or __Bold__
***Bold and Italic***
~~Strikethrough~~
<ins>Underline (HTML)</ins>
<sub>Subscript (HTML)</sub>
<sup>Superscript (HTML)</sup>
\`\`\`

**Rendered:**

*Italic* or _Italic_  
**Bold** or __Bold__  
***Bold and Italic***  
~~Strikethrough~~  
<ins>Underline (HTML)</ins>  
<sub>Subscript (HTML)</sub>  
<sup>Superscript (HTML)</sup>  

---

## Line Breaks

**Raw:**
\`\`\`markdown
Line one.  
Line two.

Line one.<br>Line two.
\`\`\`

**Rendered:**

Line one.  
Line two.

Line one.<br>Line two.

---

## Blockquotes

**Raw:**
\`\`\`markdown
> This is a blockquote.
>> Nested quote.
\`\`\`

**Rendered:**

> This is a blockquote.
>
> > Nested quote.

---

## Lists

### Unordered

**Raw:**
\`\`\`markdown
- Item 1
- Item 2
  - Subitem 2a
    - Sub-subitem 2a.i
* Item 3
+ Item 4
\`\`\`

**Rendered:**

- Item 1
- Item 2
  - Subitem 2a
    - Sub-subitem 2a.i
* Item 3
+ Item 4

### Ordered

**Raw:**
\`\`\`markdown
1. First
2. Second
   1. Subitem
   2. Subitem
\`\`\`

**Rendered:**

1. First
2. Second
   1. Subitem
   2. Subitem

---

## Links

**Raw:**
\`\`\`markdown
[Inline Link](https://fireflame135.github.io/TylerMitton/)
[Reference Link][id]
<https://fireflame135.github.io/TylerMitton/>

[id]: #links
\`\`\`

**Rendered:**

[Inline Link](https://fireflame135.github.io/TylerMitton/)  
[Reference Link][id]  
<https://fireflame135.github.io/TylerMitton/>  

[id]: #links

---

## Images

**Raw:**
\`\`\`markdown
![Alt Text](https://fireflame135.github.io/TylerMitton/assets/Professional_Headshot-97kb.avif "Optional Title")
With width limit:
<img src="https://fireflame135.github.io/TylerMitton/assets/Professional_Headshot-97kb.avif" alt="Alt Text" width="120" />
\`\`\`

**Rendered:**

![Alt Text](https://fireflame135.github.io/TylerMitton/assets/Professional_Headshot-97kb.avif "Optional Title")  
With width limit:
<img src="https://fireflame135.github.io/TylerMitton/assets/Professional_Headshot-97kb.avif" alt="Alt Text" width="120" />

---

## Code

### Inline Code

**Raw:**
\`\`\`markdown
Use the \`code\` tag.
\`\`\`

**Rendered:**

Use the \`code\` tag.

### Block Code

**Raw:**
\`\`\`\`markdown
\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`
\`\`\`\`

**Rendered:**

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

---

## Horizontal Rules

**Raw:**
\`\`\`markdown
---
***
___
\`\`\`

**Rendered:**

---
***
___

---

## Tables

**Raw:**
\`\`\`markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

| Left | Center | Right |
|:-----|:------:|------:|
| A    |   B    |     C |
\`\`\`

**Rendered:**

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

| Left | Center | Right |
|:-----|:------:|------:|
| A    |   B    |     C |

---

## Task Lists

**Raw:**
\`\`\`markdown
- [x] Task complete
- [ ] Task incomplete
\`\`\`

**Rendered:**

- [x] Task complete
- [ ] Task incomplete

---

## Mentions & Tags

**Raw:**
\`\`\`markdown
@username
#hashtag
\`\`\`

**Rendered:**

@username  
#hashtag

---

## Collapsible Sections

> Supported on GitHub and some renderers.

**Raw:**
\`\`\`markdown
<details>
<summary>Click to expand!</summary>

Hidden content here.

</details>
\`\`\`

**Rendered:**

<details>
<summary>Click to expand!</summary>

Hidden content here.

</details>

---

## HTML in Markdown

**Raw:**
\`\`\`html
<div style="color:red">This is red text using HTML</div>
\`\`\`

**Rendered:**

<div style="color:red">This is red text using HTML</div>

---

## Escaping Characters

**Raw:**
\`\`\`markdown
\\*not italic\\*
\\# Not a header
\\> Not a blockquote
\\\`Not code\\\`
\`\`\`

**Rendered:**

\\*not italic\\*  
\\# Not a header  
\\> Not a blockquote  
\\\`Not code\\\`

---

## Footnotes

> Footnotes require a renderer that supports them (e.g., GitHub, Obsidian).

**Raw:**
\`\`\`markdown
Here is a footnote reference[^1].

[^1]: This is the footnote.
\`\`\`

**Rendered:**  
Here is a footnote reference[^1].

[^1]: This is the footnote.

---

## Emojis

> Emoji codes like \`:smile:\` work on GitHub, Discord, and some renderers.

**Raw:**
\`\`\`markdown
:smile: :rocket: :100:
\`\`\`

**Rendered:**

:smile: :rocket: :100:

---

## Math (LaTeX)

> Requires a renderer with math support (e.g., Jupyter, Obsidian, some static site generators).

**Raw:**
\`\`\`markdown
Inline math: $E=mc^2$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
\`\`\`

**Rendered:**

Inline math: $E=mc^2$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

---

## End

---

`;export{n as default};

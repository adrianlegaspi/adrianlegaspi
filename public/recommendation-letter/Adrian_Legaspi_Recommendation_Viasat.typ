// Recommendation letter for Adrian Legaspi, written for Ivan Felipe Camero (Viasat) to sign.
// #ph[...] renders a highlighted placeholder; none are left in use.
// Build from the repo root, using the RenderCV venv's Typst and XCharter font:
//   .venv-cv/Scripts/python.exe -c "import typst; typst.compile('public/recommendation-letter/Adrian_Legaspi_Recommendation_Viasat.typ', output='public/recommendation-letter/Adrian_Legaspi_Recommendation_Viasat.pdf', font_paths=['.venv-cv/Lib/site-packages/rendercv_fonts/XCharter'])"

#let ph(body) = highlight(fill: rgb("#fff3a0"))[\[#body\]]

#set document(title: "Recommendation Letter - Adrian Legaspi", author: "Adrian Legaspi")
#set page(paper: "us-letter", margin: 1in)
#set text(font: "XCharter", size: 11pt, lang: "en")
#set par(justify: false, leading: 0.7em, spacing: 1.2em)

October 1, 2026

#v(0.6em)

To Whom It May Concern,

I am pleased to recommend Adrian Legaspi. I managed Adrian at Viasat from August 2022 to
September 2026, as a contract software engineer on my team engaged through Borderux.

Adrian worked on a centralized internal security dashboard used across multiple teams at
Viasat. Working alongside our security and backend engineers, Adrian architected and built the
dashboard's React and TypeScript application and was the main engineer responsible for it. The
structure of that React application and the quality of what its users saw were Adrian's
responsibility, and that responsibility was handled with care and consistency.

Although Adrian's primary role was frontend development, Adrian proved very capable of taking
on backend responsibilities. Adrian owned the platform's email notifications in our Python
backend, building the emails and connecting them to our sending services. Adrian also debugged
our backend APIs and made the required changes or fixes in the backend whenever the product
needed them. That willingness to step beyond the primary role saved the team time and kept
work moving.

Adrian is pragmatic, favoring the simplest solution that will hold up in production over
speculative complexity. Adrian communicates clearly with engineers from other disciplines and
can be trusted to own a significant part of a product without close supervision.

I recommend Adrian without reservation for senior software engineering roles. Any team looking
for a capable and dependable software engineer would be well served by this hire. Please feel free to contact me at Ivan.Camero\@viasatgov.com
to discuss Adrian's work in more detail.

Sincerely,

#v(3.2em)

#line(length: 2.6in, stroke: 0.5pt)
#v(-0.4em)
Ivan Felipe Camero \
Cyber Security Engineering Management, Viasat \
Ivan.Camero\@viasatgov.com

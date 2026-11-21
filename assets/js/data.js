/* =========================================================================
   ALIAS — site content
   -------------------------------------------------------------------------
   Edit this file to update the project facts, team, publications and
   contacts. No build step: save and reload the page.

   Any entry with `placeholder: true` shows a red "Placeholder" tag on the
   site. Remove that line once the entry is real.
   ========================================================================= */

window.ALIAS_DATA = {
  /* ---------- Project facts (shown in "01 / The project" and the footer) ---------- */
  project: {
    name: "ALIAS",
    fullName: "LLM-based authorship verification in German text",   // shown under "About ALIAS"; hidden when empty
    funder: "Federal Ministry of Research, Technology and Space (BMFTR)",
    funderShort: "BMFTR",
    programme: "Anwender Innovativ: Forschung für die zivile Sicherheit II",
    partners: [
      "University of Technology Nuremberg (UTN)",
      "A German law enforcement agency",
    ],
    period: "",                   // e.g. "2025 – 2028"; hidden when empty
    grant: "",                    // grant reference (Förderkennzeichen); hidden when empty
    grantUrl: "",                 // link to the grant record, optional
  },

  /* ---------- Research pillars (ids are used by publications) ---------- */
  pillars: {
    german: { label: "German" },
    explainability: { label: "Explainability" },
    efficiency: { label: "Efficiency" },
    synthetic: { label: "Synthetic data" },
    comparison: { label: "LLM vs. traditional" },
    "cross-domain": { label: "Cross-domain" },
  },

  /* ---------- Team ----------
     group:  one of the ids in `groups` (groups with no members are hidden)
     photo:  path such as "assets/img/people/firstname-lastname.jpg" (square works best),
             or null to show initials
     photoCredit: who the portrait belongs to (listed under the team)
     links:  [{ label: "University profile", url: "https://…" }, …]
     email:  optional; adds an "Email" link
  */
  groups: [
    { id: "team", label: "Team" },
    { id: "pi", label: "Principal investigators" },
    { id: "researcher", label: "Researchers" },
    { id: "associate", label: "Associated members & students" },
    { id: "alumni", label: "Alumni" },
  ],

  people: [
    {
      group: "team",
      title: "Prof. Dr.",
      name: "Steffen Eger",
      role: "Principal investigator",
      affiliation: "UTN",
      bio: "Steffen leads the Natural Language Learning & Generation group at UTN. His research spans language generation, evaluation, and applications of NLP in the humanities and social sciences. He is a principal investigator on ALIAS.",
      photo: "assets/img/people/steffen-eger.jpg",
      photoCredit: "UTN",
      links: [
        { label: "UTN profile", url: "https://www.utn.de/person/prof-dr-steffen-eger/" },
        { label: "Scholar", url: "https://scholar.google.com/citations?user=TnuqAW0AAAAJ" },
      ],
    },
    {
      group: "team",
      title: "Dr.",
      name: "Elena Schmidt",
      role: "Principal investigator",
      photo: null,
    },
    {
      group: "team",
      title: "Dr.",
      name: "Yamen Ajjour",
      role: "Postdoctoral researcher",
      affiliation: "UTN",
      bio: "Interested in efficiency, impersonation and obfuscation in authorship verification.",
      photo: "assets/img/people/yamen-ajjour.jpg",
      photoCredit: "NLLG",
      links: [
        { label: "UTN profile", url: "https://www.utn.de/person/dr-yamen-ajjour/" },
      ],
    },
    {
      group: "team",
      name: "Christoph Leiter",
      role: "Doctoral researcher",
      affiliation: "UTN",
      bio: "Late-stage PhD student interested in explainability in authorship verification.",
      photo: "assets/img/people/christoph-leiter.jpg",
      photoCredit: "NLLG",
      links: [
        { label: "UTN profile", url: "https://www.utn.de/person/christoph-leiter/" },
      ],
    },
    {
      group: "team",
      name: "Lotta Kiefer",
      role: "Doctoral researcher",
      affiliation: "UTN (external)",
      bio: "PhD student interested in domain- and genre-robust authorship verification.",
      photo: "assets/img/people/lotta-kiefer.jpg",
      photoCredit: "NLLG",
      links: [
        { label: "UTN profile", url: "https://www.utn.de/person/lotta-kiefer/" },
      ],
    },
    {
      group: "team",
      title: "Dr.",
      name: "Sotaro Takeshita",
      role: "Former postdoctoral researcher",
      affiliation: "UTN",
      bio: "Works on text embeddings and summarisation; co-author of the GerAV benchmark.",
      photo: "assets/img/people/sotaro-takeshita.jpg",
      photoCredit: "NLLG",
      links: [
        { label: "Website", url: "https://sotaro.io/about" },
        { label: "GitHub", url: "https://github.com/sobamchan" },
      ],
    },
  ],

  /* ---------- Publications ----------
     Newest first is automatic (sorted by `date`), grouped by year.
     date:     "YYYY-MM-DD", "YYYY-MM" or "YYYY"
     type:     BibTeX entry type: "inproceedings", "article" or "misc"
     pillars:  any of "german", "explainability", "efficiency", "synthetic", "comparison",
               "cross-domain"
     authors:  full names; names matching a team member are highlighted
     links:    url (paper page), pdf, code, data, slides, poster (all optional),
               plus `links: [{ label, url }]` for anything else (datasets, arXiv version, …)
     status:   optional, e.g. "Accepted" (shown next to the venue until the paper is out)
     note:     optional BibTeX note
     key:      optional BibTeX key for the generated entry
     figure:   optional { src, alt, caption }
     bibtex:   optional raw BibTeX string; otherwise it is generated from the fields
  */
  publications: [
    {
      id: "av-quality-efficiency",
      title: "The Quality–Efficiency Frontier in Authorship Verification: When Are LLMs Worth the Cost?",
      authors: ["Gagan Bhatia", "Yamen Ajjour", "Lotta Kiefer", "Christoph Leiter", "Elena Schmidt", "Steffen Eger"],
      venue: "alphaXiv",
      date: "2026-11-04",
      pillars: ["efficiency", "comparison"],
      summary: "Introduces TrainAVUE and InferAVUE, two measures that relate F1 gains to training and inference time and memory, and compares 10 LLMs with 11 non-LLM methods on two English and two German benchmarks. Fine-tuned LLMs beat the strongest non-LLM methods by 10–19 F1; QLoRA cuts training memory by 55% and token pruning cuts inference latency by 38% while keeping 97.8% of F1. LLMs offer the better trade-off on short texts, while non-LLM methods stay competitive on long ones.",
      url: "https://www.alphaxiv.org/abs/2611.llms-authorship-verification-efficiency",
      pdf: "https://www.alphaxiv.org/abs/2611.llms-authorship-verification-efficiency.pdf",
      // BibTeX as published on the first author's website
      bibtex: `@misc{bhatia2026qualityefficiency,
  title     = {The Quality–Efficiency Frontier in Authorship Verification: When Are LLMs Worth the Cost?},
  author    = {Bhatia, Gagan and Ajjour, Yamen and Kiefer, Lotta and Leiter, Christoph and Schmidt, Elena and Eger, Steffen},
  year      = {2026},
  publisher = {alphaXiv},
  url       = {https://www.alphaxiv.org/abs/2611.llms-authorship-verification-efficiency}
}`,
    },
    {
      id: "avshift",
      key: "kiefer2026avshift",
      title: "When Writing Style Drifts: Benchmarking Authorship Verification under Distribution Shifts in Genre, Time and the AI-Era",
      authors: ["Lotta Kiefer", "Brisca Balthes", "Christoph Leiter", "Yamen Ajjour", "Elena Schmidt", "Steffen Eger"],
      venue: "EACL (main)",
      status: "Accepted",
      note: "Accepted at EACL (main)",
      type: "misc",
      eprint: "2608.17979",
      doi: "10.48550/arXiv.2608.17979",
      date: "2026-08-18",
      pillars: ["german", "explainability", "cross-domain"],
      summary: "AVShift is the first German benchmark for authorship verification under distribution shift: over 150,000 text pairs spanning three genres and 21 years. Fine-tuned LLMs generalise best across genres, and temporal drift is one of the strongest factors degrading performance, while the benchmark shows no measurable shift from the AI era.",
      url: "https://arxiv.org/abs/2608.17979",
      pdf: "https://arxiv.org/pdf/2608.17979",
    },
    {
      id: "gerav",
      title: "GerAV: Towards New Heights in German Authorship Verification using Fine-Tuned LLMs on a New Benchmark",
      authors: ["Lotta Kiefer", "Christoph Leiter", "Sotaro Takeshita", "Elena Schmidt", "Steffen Eger"],
      venue: "Findings of ACL 2026",
      date: "2026-07",
      pillars: ["german", "cross-domain"],
      summary: "GerAV is a benchmark for German authorship verification with over 400k labelled text pairs from Twitter and Reddit, split into in-domain, cross-domain and profile-based subsets. A fine-tuned LLM beats recent baselines by up to 0.09 F1 and zero-shot GPT-5 by 0.08; models trained on one data type do best on matching data but generalise less well to others.",
      url: "https://aclanthology.org/2026.findings-acl.1991/",
      pdf: "https://aclanthology.org/2026.findings-acl.1991.pdf",
      code: "https://github.com/NL2G/GerAV",
      links: [
        { label: "arXiv", url: "https://arxiv.org/abs/2601.13711" },
        { label: "Data: Reddit", url: "https://huggingface.co/datasets/nllg/GerAV-Reddit" },
        { label: "Data: Twitter", url: "https://huggingface.co/datasets/nllg/GerAV-Twitter" },
      ],
      // Official BibTeX from the ACL Anthology
      bibtex: `@inproceedings{kiefer-etal-2026-gerav,
    title = "{G}er{AV}: Towards New Heights in {G}erman Authorship Verification using Fine-Tuned {LLM}s on a New Benchmark",
    author = "Kiefer, Lotta  and
      Leiter, Christoph  and
      Takeshita, Sotaro  and
      Schmidt, Elena  and
      Eger, Steffen",
    editor = "Liakata, Maria  and
      Moreira, Viviane P.  and
      Zhang, Jiajun  and
      Jurgens, David",
    booktitle = "Findings of the {A}ssociation for {C}omputational {L}inguistics: {ACL} 2026",
    month = jul,
    year = "2026",
    address = "San Diego, California, United States",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.findings-acl.1991/",
    doi = "10.18653/v1/2026.findings-acl.1991",
    pages = "40050--40069",
    ISBN = "979-8-89176-395-1"
}`,
    },
  ],

  /* ---------- Contact ---------- */
  contacts: [
    { label: "Contact at UTN", name: "Prof. Dr. Steffen Eger", email: "steffen.eger@utn.de" },
  ],
};

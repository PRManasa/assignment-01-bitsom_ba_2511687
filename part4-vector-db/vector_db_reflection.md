# Vector DB Notes

## Vector DB Use Case

A traditional keyword-based search would not suffice for a law firm wanting to query 500-page contracts in plain English. Keyword search works by matching exact or near-exact terms between the query and the document. If a lawyer asks "What are the termination clauses?", a keyword system would scan for the literal words "termination" and "clauses" — and would fail entirely if the contract uses synonyms but not the same words. Legal documents are bound to have varied and archaic language, making keyword matching unreliable.

This is solved by vector databases. A vector database works by converting both the contract text and the lawyer's query into high-dimensional numerical vectors — called embeddings — using a language model. These embeddings capture the *semantic meaning* of the text, not just the words. Two sentences that mean the same thing will have embeddings that are close together in vector space, even if they share no common words. A similarity search then retrieves the passages whose embeddings are closest to the query embedding.

In this system, the workflow would be: split each contract into chunks (paragraphs or sections), generate an embedding for each chunk, and store these embeddings in a vector database. When a lawyer submits a plain-English query, the system embeds the query and retrieves the top matching contract sections by cosine similarity.

The vector database plays the role of a semantic index — enabling fast, meaning-aware retrieval across hundreds of pages that would be impossible with keyword search alone.

# Donkey Chatbot

## Overview
Donkey Chatbot is a rule-based conversational system that does not utilize AI or deep learning. Instead, it relies on **TF-IDF with Cosine Similarity** for response retrieval and **Levenshtein Distance** for grammar correction. The chatbot is powered by a curated **question-answer catalog** and operates using a **Deno-based backend** with WebSockets for real-time communication.
This project was developed at **ITECH Wilhelmsburg** as part of a collaborative team effort for **Challenge 2 in the first school block**.

## Features
- **TF-IDF Algorithm**: Identifies the most relevant responses based on term frequency and cosine similarity.
- **Levenshtein Distance**: Implements a spell-checking mechanism for improved user input processing.
- **WebSockets Communication**: Enables seamless interaction between frontend and backend.
- **Custom Question Catalog**: Includes a set of predefined questions and responses with variations specifically for the BUGLAND Ltd. Customer Support.
- **Modern Frontend Design**: User-friendly interface for chatbot interaction.

## Setup & Installation
### Prerequisites
Ensure that you have **Deno** installed. On Windows, you can install it using:
```powershell
irm https://deno.land/install.ps1 | iex
```
Or, if the above command does not work:
```powershell
winget install DenoLand.Deno
```

### Installing Dependencies
```sh
deno install
```

### Running the Server
```sh
deno task dev
```

## References
- [Deno Installation Guide](https://docs.deno.com/runtime/getting_started/installation/)
- [O2 Aura](https://www.o2.de/aura) (Example of another chatbot)
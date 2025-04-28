# 🚀 flutter-companion

![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-green.svg)](https://nodejs.org/)
[![Flutter](https://img.shields.io/badge/flutter-%3E=3.0.0-blue.svg)](https://flutter.dev/)

---

## Sommaire

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Exemple d’arborescence générée](#exemple-darborescence-générée)
- [Tags](#tags)
- [Contribuer](#contribuer)
- [Support](#support)
- [Licence](#licence)

---

## Description

**flutter-companion** est un compagnon en ligne de commande pour accélérer le développement Flutter.  
Il permet de générer rapidement des pages, des routes, et d’implémenter le routing dans vos projets Flutter, tout en respectant une structure de code propre et maintenable.

---

## Fonctionnalités

- Génération de pages Flutter avec template personnalisable
- Ajout automatique de routes dans le routeur GoRouter
- Implémentation rapide du module de routing (`go_router`)
- Commandes simples et intuitives

---

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [Flutter](https://flutter.dev/) >= 3

### Installation globale

```bash
npm install -g flutter-companion
```

### Ou installation locale (dans un projet)

```bash
npm install flutter-companion --save-dev
```

---

## Utilisation

### Générer une page Flutter

```bash
flutter-companion generate page pages/ma_page
```

### Ajouter une route

```bash
flutter-companion generate route nomRoute pages/ma_page
```

### Implémenter le module de routing

```bash
flutter-companion implements router
```

---

## Exemple d’arborescence générée

```
lib/
├── pages/
│   └── ma_page.dart
├── router.dart
```

---

## Tags

`flutter` `cli` `utils` `generator` `go_router` `productivity` `scaffolding` `companion`

---

## Contribuer

Les contributions sont les bienvenues !  
Pour proposer une amélioration, ouvrez une issue ou une pull request.

---

## Support

Pour toute question ou problème, ouvrez une issue sur [GitHub](https://github.com/flojucv/flutter-companion/issues).

---

## Licence

MIT © Florian (flojucv)
# SPEC — Intervio

> Application SaaS de gestion d'interventions pour PME et artisans du bâtiment.

---

## Table des matières

1. [Présentation](#1-présentation)
2. [Rôles & Permissions](#2-rôles--permissions)
3. [Onboarding](#3-onboarding)
4. [Entités du domaine](#4-entités-du-domaine)
5. [Workflow des interventions](#5-workflow-des-interventions)
6. [Règles métier](#6-règles-métier)
7. [Fonctionnalités](#7-fonctionnalités)
8. [Traçabilité](#8-traçabilité)
9. [RGPD & Conformité](#9-rgpd--conformité)
10. [Hors scope](#10-hors-scope)
11. [Critères de fin de projet](#11-critères-de-fin-de-projet)
12. [Stack technique](#12-stack-technique)

---

## 1. Présentation

### Objectif

Intervio est une application SaaS multi-tenant destinée aux **PME et artisans du bâtiment**.
Elle permet d'organiser, planifier, assigner et suivre des interventions terrain, tout en réduisant la charge administrative.

### Modèle économique

Chaque entreprise souscrit à un **abonnement** (mensuel ou annuel) pour accéder à l'application.
Chaque entreprise dispose de son propre espace isolé — les données d'une entreprise ne sont jamais visibles par une autre.

| Plan | Prix | Inclus |
|------|------|--------|
| Starter | 29€/mois | Jusqu'à 5 utilisateurs |
| Pro | 59€/mois | Utilisateurs illimités + pièces jointes |
| Business | 99€/mois | Tout + historique avancé + exports |

### Utilisateurs

L'application est utilisée par deux types de personnes :
- **L'équipe interne** de l'entreprise (patron, planificateur, technicien)
- **Les clients** de l'entreprise, en consultation lecture seule uniquement

---

## 2. Rôles & Permissions

| Rôle | Description |
|------|-------------|
| `PATRON` | Propriétaire de l'entreprise. Accès total. |
| `PLANIFICATEUR` | Membre de l'équipe chargé d'organiser les interventions. |
| `TECHNICIEN` | Membre de l'équipe qui réalise les interventions sur le terrain. |
| `CLIENT` | Client de l'entreprise. Accès lecture seule à ses interventions. |

### Détail des permissions

**PATRON**
- Voir toutes les interventions
- Annuler une intervention (SCHEDULED ou IN_PROGRESS)
- Consulter l'historique complet
- Gérer les paramètres de l'entreprise
- Inviter des membres (planificateur, technicien)
- Modifier le rôle d'un membre
- Désactiver un compte membre (soft delete)
- Créer / modifier un client

**PLANIFICATEUR**
- Créer une intervention
- Planifier une date
- Assigner un ou plusieurs techniciens
- Modifier une intervention
- Suivre l'avancement
- Créer / modifier un client

**TECHNICIEN**
- Voir ses interventions assignées
- Démarrer une intervention
- Terminer une intervention
- Signaler un problème
- Rédiger un compte rendu structuré

**CLIENT**
- Consulter ses interventions liées à son code (lecture seule)

---

## 3. Onboarding

### Inscription PATRON — Stepper 2 étapes (1 seule transaction)

```
Étape 1 — Vos informations
  Prénom, Nom, Email, Mot de passe
  ☐ J'accepte les CGU et la Politique de confidentialité (obligatoire)

Étape 2 — Votre entreprise
  Nom, Téléphone, Adresse, Ville, Code postal
  → Bouton "Créer mon compte"
  → User + Company créés en une seule transaction en base

Succès → Redirection vers /dashboard
```

> Rien n'est sauvegardé en base tant que les 2 étapes ne sont pas validées.
> Élimine les comptes zombies sans cron job.

### Invitation des membres de l'équipe

```
Le patron saisit l'email du membre + choisit son rôle
  → Un email d'invitation est envoyé avec un token unique
  → Le membre clique sur le lien (/invite/:token)
  → Il crée son mot de passe
  → Rôle assigné automatiquement depuis le token
  → Accès immédiat
```

> Seul un email invité peut rejoindre l'entreprise.
> Le rôle est défini par le patron, jamais par l'employé.

### Accès client

```
Une intervention est créée
  → Un code unique est généré (ex: INT-2024-0042)
  → Le patron ou planificateur envoie le code au client
  → Le client s'inscrit sur /join/:code
  → ☐ J'accepte les CGU et la Politique de confidentialité (obligatoire)
  → Rôle CLIENT assigné automatiquement
  → Accès lecture seule aux interventions liées au code
```

> Un client peut utiliser plusieurs codes pour accéder à plusieurs interventions.

---

## 4. Entités du domaine

| Entité | Description |
|--------|-------------|
| `User` | Tout utilisateur de l'application (équipe interne + clients) |
| `Company` | L'entreprise abonnée au service |
| `Customer` | Le client de l'entreprise pour lequel on réalise des interventions |
| `Intervention` | Le cœur du métier — une mission à réaliser |
| `InterventionTechnician` | Table de liaison — plusieurs techniciens par intervention |
| `InterventionEvent` | Trace horodatée de tout ce qui se passe sur une intervention |
| `Report` | Compte rendu structuré soumis par un technicien |
| `Attachment` | Pièce jointe liée à une intervention (photo, document...) |
| `Comment` | Commentaire laissé par un utilisateur sur une intervention |
| `Invitation` | Invitation envoyée par email pour rejoindre l'équipe |
| `ConsentLog` | Trace des consentements RGPD des utilisateurs |

> ⚠️ L'adresse n'est pas une entité à part entière. Elle est stockée directement dans les entités qui en ont besoin (Company, Customer, Intervention).

### Relations clés

- Un `User` appartient à une `Company`
- Un `Customer` appartient à une `Company` et peut avoir un compte `User`
- Une `Intervention` appartient à une `Company`, est liée à un `Customer` et peut avoir plusieurs techniciens via `InterventionTechnician`
- Un `Report` est lié à une `Intervention` et à un `User` (technicien) — un rapport par technicien
- Un `InterventionEvent` est lié à une `Intervention` et tracé avec auteur + date
- Un `Attachment` est lié à une `Intervention`, stocké sur Cloudinary
- Un `Comment` est lié à une `Intervention` et peut être privé (équipe uniquement)
- Un `ConsentLog` trace chaque consentement donné par un `User`

---

## 5. Workflow des interventions

```
DRAFT
  ↓ planifier (PLANIFICATEUR, PATRON)
SCHEDULED
  ↓ démarrer (TECHNICIEN assigné uniquement)
IN_PROGRESS
  ↓ terminer (TECHNICIEN assigné uniquement)
COMPLETED

Depuis SCHEDULED ou IN_PROGRESS :
  ↓ annuler (PATRON uniquement)
CANCELED
```

| Statut | Signification |
|--------|--------------|
| `DRAFT` | Intervention créée mais pas encore planifiée |
| `SCHEDULED` | Date et technicien(s) assignés |
| `IN_PROGRESS` | Technicien a démarré l'intervention |
| `COMPLETED` | Intervention terminée, conservée dans l'historique |
| `CANCELED` | Intervention annulée par le patron |

---

## 6. Règles métier

- Seuls le **PLANIFICATEUR** et le **PATRON** peuvent faire passer une intervention de `DRAFT` à `SCHEDULED`
- Seul le **TECHNICIEN assigné** peut démarrer (`SCHEDULED` → `IN_PROGRESS`)
- Seul le **TECHNICIEN assigné** peut terminer (`IN_PROGRESS` → `COMPLETED`)
- Seul le **PATRON** peut annuler une intervention (`SCHEDULED` ou `IN_PROGRESS` → `CANCELED`)
- On ne peut pas démarrer une intervention encore en `DRAFT`
- Une intervention `IN_PROGRESS` ne peut plus être replanifiée
- Une intervention `COMPLETED` ou `CANCELED` est en lecture seule
- Un technicien peut avoir plusieurs interventions `IN_PROGRESS` simultanément
- Une intervention peut avoir plusieurs techniciens assignés
- Chaque technicien soumet son propre `Report`
- Un **CLIENT** ne peut accéder qu'aux interventions liées à son code, en lecture seule
- Les commentaires marqués `isPrivate` ne sont pas visibles par les clients
- Chaque entreprise est **isolée** — un utilisateur ne peut jamais voir les données d'une autre entreprise

---

## 7. Fonctionnalités

### Authentification & Onboarding
- Inscription patron (stepper 2 étapes, 1 transaction)
- Inscription membre via lien d'invitation
- Inscription client via code d'intervention
- Connexion / déconnexion
- Mot de passe oublié / réinitialisation
- Accès conditionné au rôle

### Gestion de l'équipe (PATRON)
- Inviter un membre par email avec un rôle
- Modifier le rôle d'un membre
- Désactiver un compte membre (soft delete)

### Gestion des clients (PATRON, PLANIFICATEUR)
- Créer un client
- Modifier les informations d'un client
- Consulter les interventions d'un client

### Gestion des interventions
- Créer une intervention (`DRAFT`) avec priorité et type
- Planifier une date et assigner un ou plusieurs techniciens (`SCHEDULED`)
- Démarrer une intervention (`IN_PROGRESS`)
- Terminer une intervention (`COMPLETED`)
- Annuler une intervention (`CANCELED`)
- Consulter le détail d'une intervention
- Consulter l'historique

### Compte rendu & Rapports
- Rédiger un compte rendu structuré (contenu, matériaux, problème)
- Signaler un problème pendant une intervention

### Pièces jointes & Commentaires
- Ajouter une pièce jointe à une intervention (stockée sur Cloudinary)
- Laisser un commentaire public ou privé sur une intervention

### RGPD
- Consentement obligatoire à l'inscription (CGU + Politique de confidentialité)
- Suppression de compte (anonymisation des données personnelles)
- Export des données personnelles d'un utilisateur
- Pages légales : CGU, Politique de confidentialité, Mentions légales

---

## 8. Traçabilité

Tout changement important est tracé via un `InterventionEvent` :

| Événement | Informations tracées |
|-----------|---------------------|
| `STATUS_CHANGED` | Ancien statut, nouveau statut, auteur, date |
| `TECHNICIAN_ASSIGNED` | Technicien assigné, auteur, date |
| `TECHNICIAN_REMOVED` | Technicien retiré, auteur, date |
| `CUSTOMER_ASSIGNED` | Client lié, auteur, date |
| `COMMENT_ADDED` | Auteur, date, privé ou non |
| `ATTACHMENT_ADDED` | Auteur, date, nom du fichier |
| `REPORT_SUBMITTED` | Technicien, date |
| `ISSUE_REPORTED` | Technicien, date, détail |

---

## 9. RGPD & Conformité

### Consentements
- Case à cocher obligatoire CGU + Politique de confidentialité à chaque inscription
- Chaque consentement est tracé dans `ConsentLog` (type, version, IP, date)
- Pas d'accès à l'app sans consentement validé

### Droits des utilisateurs
- **Droit d'accès** : export de toutes les données personnelles (JSON)
- **Droit à l'effacement** : anonymisation des données personnelles sous 30 jours
- **Droit de rectification** : modification des informations personnelles

### Durées de conservation
| Donnée | Durée |
|--------|-------|
| Comptes actifs | Tant que l'abonnement est actif |
| Comptes supprimés | Anonymisation sous 30 jours |
| Historique interventions | 5 ans (obligation légale bâtiment) |
| Logs de connexion | 1 an |
| ConsentLog | 5 ans (preuve de consentement) |

### Pages légales obligatoires
- `/cgu` — Conditions Générales d'Utilisation
- `/privacy` — Politique de confidentialité
- `/legal` — Mentions légales

---

## 10. Hors scope

Les fonctionnalités suivantes sont **explicitement exclues** de la v1 :

- Paiement en ligne (intégration Stripe...)
- Facturation complète
- Devis
- Notifications push / SMS
- Géolocalisation en temps réel
- Application mobile native
- Gestion des stocks
- Multi-langue
- IA / recommandations
- Planning avancé avec drag & drop
- Signature électronique
- Lien public d'intervention sans compte (accès client v2)
- Bandeau cookies (v2)

---

## 11. Critères de fin de projet

- [ ] Un patron peut s'inscrire et créer son entreprise en une transaction
- [ ] Un patron peut inviter des membres par email
- [ ] Un client peut s'inscrire via un code d'intervention
- [ ] Tous les rôles peuvent se connecter et accéder à leur espace
- [ ] Le workflow complet fonctionne (DRAFT → COMPLETED)
- [ ] Les règles métier sont respectées et testées
- [ ] L'historique est tracé sur toutes les actions importantes
- [ ] Les permissions sont appliquées par rôle
- [ ] Les données sont isolées par entreprise (multi-tenant)
- [ ] Le consentement RGPD est recueilli et tracé à l'inscription
- [ ] La suppression de compte anonymise les données personnelles
- [ ] Les pages légales (CGU, Politique de confidentialité, Mentions légales) existent

---

## 12. Stack technique

| Couche | Technologie |
|--------|-------------|
| Back-end | NestJS (Node.js / TypeScript) |
| ORM | Prisma |
| Base de données | PostgreSQL |
| Authentification | JWT (access token + refresh token) |
| Stockage fichiers | Cloudinary |
| Conteneurisation | Docker / Docker Compose |
| Versioning | Git / GitHub |
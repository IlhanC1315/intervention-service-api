Section 1

Cette application sert à organiser, planifier des interventions assigner des techniciens et suivre l'avancement. 
Elle est destinée aux PME / artisans du bâtiment afin de savoir qui fait quoi et quand et gagner du temps administratif.

L'application est utilisée par l'équipe interne et les clients peuvent consulter leurs interventions sans pouvoir modifier seulement en lecture seule.
Le patron aura le droit de voir toutes les interventions, annuler une intervention, gérer les paramètres de l'entreprise et consulter l'historique.
Le planificateur aura le droit de créer une intervention, planifier une date, assigner un technicien, modifier une intervention et suivre l'avancement.
Le technicien aura le droit de voir ses interventions, démarrer terminer une intervention, signaler un problème et faire un compte rendu.

Section 2

- User : Utilisateurs qui vont utilisé l'application
- Company : Pour les entreprises PME du batiment
- Customer : Client pour lequel on réalise des interventions
- Intervention : coeur du métier donc les interventions missions 
- InterventionEvent : Ce qui permet de garderune trace de ce qui se passe
- Attachment : Contient des pièces joints soit images, administratif...
- Comment : Permet au utilisateurs de laisser des commentaires*

Notes : 
- L'adresse n'est pas une entité à part entière 

Section 3

Le Workflow final serait :
DRAFT -> SCHEDULED -> IN_PROGRESS -> COMPLETED (+ CANCELED) 
(Brouillon -> Planifiée -> En cours -> Terminée (+ Annulée))

DRAFT
  ↓ planifier (planificateur, patron)
SCHEDULED
  ↓ démarrer (Technicien)
IN_PROGRESS
  ↓ terminer (Technicien)
COMPLETED

Section 4

Seul le planificateur et le patron peuvent planifier une intervention
Seul le technicien assigné peut démarrer l'intervention puis la terminer 
Seul le patron peut annuler une intervention lors de la planification
On ne peut pas démarrer (SCHEDULED) si la planification n'est pas fini (DRAFT)
Une intervention démarrée ne peut plus etre replanifier
Quand une intervention est terminer alors elle est conservée dans un historique
Les clients peuvent uniquement consulter leurs intervention en lecture seule

Section 5

Ce que l'utilisateur doit pouvoir faire pour accéder à l'app :
- se connecter
- se déconnecter
- accéder selon son rôle

Ce que le patron doit pouvoir faire avec les utilisateurs :
- modifier un rôle
- désactiver un compte
- créer un utilisateur

Ce que doit pouvoir faire avec les clients :
- créer un client 
- modifier ses informations 
- consulter ses interventions 

Les actions indispensables pour gérer une intervention :
- créer une intervention
- planifier une date
- assigner un technicien 
- consulter l'historique 
- changer l'état

Ce qu'on doit absolument tracer :
- changement d'état
- actions importantes
- auteur + date
- technicien assigné
- clients assigné

Section 6

Hors scope :
- Paiement en ligne
- Facturation complète 
- Devis 
- Notification push / SMS 
- Géolocalisation en temps réel
- Application mobile native
- Gestion des stocks
- Multi langue 
- IA / recommandations
- Planning avancé (drag & drop)
- Signature éléctronique

Section 7

Le projet sera fini quand :
- Tous les rôles peuvent se connecter
- Le workflow complet fonctionne 
- Les règles métier sont respectées
- L'historique est tracé
- Les permissions sont appliquées




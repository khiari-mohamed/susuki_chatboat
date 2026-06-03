Objet : Prérequis serveur pour l'intégration du Chatbot Suzuki Parts — Action requise avant la visite sur site

Cher/Chère Suzuki 

Suite à notre visite d'aujourd'hui — afin d'assurer une intégration fluide et efficace lors de mon retour sur site, j'ai besoin que votre équipe informatique/personne prépare l'environnement serveur à l'avance. Cela permettra de gagner un temps considérable et de tout finaliser en une seule visite.

Prérequis Serveur
1. Système d'exploitation (Fortement recommandé)
Ubuntu Linux 22.04 LTS ou 24.04 LTS (installation fraîche ou existante)
Si Ubuntu n'est absolument pas possible, Windows Server 2019+ avec WSL2 (Windows Subsystem for Linux) activé peut fonctionner, mais cela ajoute de la complexité et pourrait nécessiter du temps de dépannage supplémentaire.

2. Spécifications du serveur
CPU : 2+ cœurs
RAM : 4 Go minimum (8 Go recommandé)
Espace disque : 20 Go libres minimum
OS : Ubuntu 22.04/24.04 LTS

3. Méthode d'accès (par ordre de préférence)

Option A — Accès à distance (Préféré)
Cela me permet de tout configurer à distance sans avoir besoin d'être physiquement sur site. J'aurais besoin de :
Accès SSH (adresse IP, port, nom d'utilisateur, mot de passe ou clé .pem)
OU Accès bureau à distance (AnyDesk, TeamViewer, ou RDP)
Cela signifie que nous pourrions potentiellement terminer l'intégration cette semaine sans attendre une autre visite sur site.

Option B — Visite sur site
Si l'accès à distance n'est pas possible en raison des politiques de sécurité, veuillez préparer le serveur selon les exigences ci-dessous et je viendrai sur site. Avoir tout prêt à l'avance signifie que le travail sur site prendra 2-3 heures au lieu d'une journée entière.

Liste de vérification pré-installation (Votre informatique devrait compléter avant mon arrivée)
Si votre équipe informatique peut pré-installer ces éléments, le travail sur site sera beaucoup plus rapide :

# 1. Mettre à jour le système
sudo apt update && sudo apt upgrade -y
# 2. Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql
# 3. Installer Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
# Vérifier les versions :
node -v    # devrait afficher v20.x.x
npm -v     # devrait afficher 10.x.x
psql --version

S'ils ne peuvent pas pré-installer, je le ferai lors de la visite sur site — cela ajoute juste environ 30-45 minutes.

Identifiants dont j'aurai besoin
Veuillez préparer ceux-ci (de manière sécurisée — peuvent être partagés par appel téléphonique ou message chiffré) :

Accès SSH/RDP au serveur --> Oui
Mot de passe sudo/root du serveur--> Oui
Identifiant administrateur WordPress-->  Oui (pour coller une balise script)
Nom(s) de domaine --> Oui
Informations certificat SSL existant (le cas échéant)	Si applicable

Résumé — Ce dont j'ai besoin de votre part maintenant
Veuillez répondre à ces 3 questions :
Pouvez-vous fournir un accès à distance (SSH ou AnyDesk) ? → Nous pouvons terminer cette semaine sans autre visite.
Si non, votre équipe informatique peut-elle pré-installer PostgreSQL + Node.js ? → Rend la visite sur site beaucoup plus courte.
Quel OS serveur sera utilisé ? → Ubuntu est fortement préféré.


Une fois que j'aurai ces réponses, je pourrai vous donner un calendrier exact. Si l'accès à distance est possible, je peux commencer dès que les identifiants sont fournis. Si une visite sur site est nécessaire, je planifierai en conséquence une fois le serveur prêt.
Dans l'attente de finaliser cette intégration pour vous.
Cordialement,

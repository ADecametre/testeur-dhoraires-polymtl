# Testeur d'horaires <sub><sup>(Polytechnique Montréal)</sup></sub>

Le Testeur d'horaire est un script qui permet de tester instantanément une liste d'horaires sur le dossier étudiant de Polytechnique Montréal.

Cela évite de devenir fou en rentrant manuellement des numéros de groupe, en ayant 100 fois de suite le messsage `Il n'y a plus de places pour le groupe x`, puis en ayant un message d'erreur lorsque l'horaire choisi n'est plus disponible.

[![Installer](https://img.shields.io/badge/Installer-darkgreen?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA7xJREFUeF7tm02oVVUUx3//tAJFaCBFHzpInBUIQlObWqhgEIi8TIgGQZSQRvDIfBY98WOQoBANUokKAoNQHEiTEIdBg6AIBMH3SCWtBomiy7Ng33jvdva+59xz3n33dveGxxuc/bHWb6+z13/vfa4Y86Ix958MIEfAmBNYlFfAzB4C9gMTxf8lwOfApKQ7g56PxQIwDbzb5exhSe+MC4ArwBNdzl6T9Oi4ALAyRyUNPCIHPqA7bmYZQI6AEgL5FchrQF4EB74oD3zAnAVyGsw6IAuhrASzFM57gbwZypuhvBn6L4G8Gxz23aCZ+d5hF/AG4Ce7XwD7JN2qc5bXlg4ws4cLZb03nC4/AJwE3q9zulxrM2Rmfmp7sMvZH4Atkm5UhdAGADN7BDgNPN817keSJqvaUhfAr8Wsry3p/Gdgo6TLVQZuCsDMngLOAs+WjDcj6ckqdnidugB+A9ZEOvej7hck/dRr8CYAzOyZ4PyqyDizkrqP3KMm1QXg79sHCQf/BLZK+j4FoV8AZrYB+Bbw8I8VX5NSNs5rVxeAX2N9BryaMOC2P5f0ZaxOPwDM7OWwyPnCFyt+xfaapLu9orDzvBYAbxQygUeC/0V9BKZiM1EXgJm9BRwp+vSVPlY+Ad6WVCqzY41qA+h0ZGY7i+utT4GlCaOOBqPuza1TFUBF2D7bb0o6XnXW59brG0CIhk3AV8CyxOCeqrZL+mcOvJ6boXCD7CG9LdG3648JSd/047y3aQQgQHgO+A5IXWxeBDZLuh7aJAGEHO+LnS96sfJH6PNCv863AiA49DRwLqIROvb9qxVSr4CZeQo7U6z26xKOXQq645cmzrcGIEB4LBi+PmHUrGuFQjn+GKnTyfGrE324znC94bqjcWn8CnQtbsuBr4EXE5b9DayIPL/ZI8efB16S9Fdjz0MHrQIIkeBa4RjweltGhn58o+M5vtXPaFoHECB4v1P+3U9LED4Mu7xaOb7K2AsCoDNwRa2QsrNRjl90ACEaqmiFMlsb5/ihABAgVNEKc+1tJccPDYAAoYpW8Kqt5fihAlBRK7Sa44cOQIAQ0wqt5/ihBBAgPAjsBl4JRp4ADrWd44cWQBXDBlVnQXXAoJxoMk4G0ITe/6FtaQR0fc//+Ig7ejX1e4QYgLLv+UecA6W/R4gBKPuef9QBlP4eIQbg9x5nfKMIo/TKLAbgALBnFL1M2Dwt6b3u5zEArtQ+LjYmO4CVIw5iprjPPBUOVPzWal7JOmDEZ7ex+TkCGiMc8Q7GPgLuA2E6cVARaA3kAAAAAElFTkSuQmCC&link=https://www.tampermonkey.net/script_installation.php#url=https://github.com/ADecametre/testeur-dhoraires-polymtl/raw/refs/heads/main/script.user.js)](https://www.tampermonkey.net/script_installation.php#url=https://github.com/ADecametre/testeur-dhoraires-polymtl/raw/refs/heads/main/script.user.js)
<br>
<sup><sup>[Cliquez ici si le bouton ne fonctionne pas](https://github.com/ADecametre/testeur-dhoraires-polymtl/raw/refs/heads/main/script.user.js)</sup></sup>

| Avant | Après |
| --- | --- |
| ![Avant](https://github.com/user-attachments/assets/7a45f5ab-80b1-4c70-8d05-93e1c071594e) | ![Après](https://github.com/user-attachments/assets/709f9e18-a49b-4134-9d2c-7b508c1165e2) |

## Comment l'utiliser

#### Vidéo tutoriel

[![Tutoriel YouTube](https://img.youtube.com/vi/FrNNbJoBN2k/0.jpg)](https://youtu.be/FrNNbJoBN2k)

### Après avoir reçu son horaire

1. Rendez-vous sur [le générateur d'horaires de l'AEP](https://beta.horaires.aep.polymtl.ca/).
2. Rentrez les cours que vous souhaitez suivre*.
3. Modifiez les paramètres (*Horaire personnel*, *Finir plus tôt*, etc.).
4. Cliquez sur `Générer les horaires`.
5. Sous les horaires qui vous intéressent, cliquez sur `Ajouter aux favoris`.
6. Cliquez sur `Afficher les favoris` et classez votre liste d'horaires en ordre de préférence.

La liste restera stockée sur votre navigateur. Vous pouvez `Exporter` votre liste de favoris pour vous assurer de ne pas la perdre.

<sup>* Pour voir tous les groupes possibles, mettez tous les groupes en vert. Pour voir seulement les groupes présentement disponibles, mettez en vert vos groupes actuels et ne touchez pas aux autres groupes.</sup>

### Pendant la période de modification d'horaire

1. Ouvrez le module `Modifications de choix de cours` du [dossier étudiant](https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet).
2. Cliquez sur le bouton `Ouvrir le Testeur d'horaires :)`.
3. Cliquez sur `Tester`.

Le Testeur essaiera un par un les horaires fournis jusqu'à ce qu'il trouve un horaire disponible. Il remplit alors automatiquement tous les champs du formulaire (sans cliquer sur le bouton `Enregistrer`).

<sup>Vous pouvez voir toutes les opérations effectuées par le Testeur et les messages renvoyés par le dossier étudiant en cliquant sur `Afficher tous les messages`.</sup>

Vous pouvez `Rafraîchir` la page ou `Modifier votre liste d'horaires`, puis, lorsque vous êtes satisfait, `Enregistrer` votre choix de cours.

## Comment ça fonctionne

Premièrement, comment fonctionne le dossier étudiant ? Lorsque la page `Modifications de choix de cours` du dossier étudiant charge, la liste des places disponibles de tous les groupes de tous les cours de l'université est chargée localement. Lorsque vous modifiez un cours ou un groupe, la page utilise cette liste locale pour déterminer s'il reste de la place. La page ne communique pas avec le serveur avant que le bouton `Enregistrer` soit cliqué. Donc lorsque la page indique qu'il reste de la place, cela signifie qu'il restait de la place au moment où vous avez ouvert la page. C'est pourquoi le dossier étudiant affiche instantanément s'il y a de la place et c'est pourquoi ça peut vous donner un message d'erreur après avoir cliqué sur `Enregistrer`.

Ainsi, lorsque le Testeur d'horaires reçoit une liste d'horaires, il ne fait que remplir très rapidement le formulaire en interceptant les messages du dossier étudiant. Lorsque que le Testeur détecte certains mots-clés (comme « plus de places »), il passe à l'horaire suivant, et lorsqu'aucun mot-clé n'est détecté, il s'arrête et indique que l'horaire est disponible.

Le Testeur fonctionne donc entièrement sur votre appareil et ne communique pas avec le serveur du dossier étudiant. (Juste n'abusez pas du bouton `Rafraîchir`. :))

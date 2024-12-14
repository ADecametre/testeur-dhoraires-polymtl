# Testeur d'horaires <sub><sup>(Polytechnique Montréal)</sup></sub>

Le Testeur d'horaire est un script qui permet de tester instantanément (en moins d'une seconde) une liste d'horaires sur le dossier étudiant de Polytechnique Montréal.

Cela évite de devenir fou en rentrant manuellement ses choix d'horaires et en ayant 100 fois de suite le messsage `Il n'y a plus de places pour le groupe x` sur un site qui date probablement des années 2000.

[![Installer](https://img.shields.io/badge/Installer-darkgreen?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA7xJREFUeF7tm02oVVUUx3//tAJFaCBFHzpInBUIQlObWqhgEIi8TIgGQZSQRvDIfBY98WOQoBANUokKAoNQHEiTEIdBg6AIBMH3SCWtBomiy7Ng33jvdva+59xz3n33dveGxxuc/bHWb6+z13/vfa4Y86Ix958MIEfAmBNYlFfAzB4C9gMTxf8lwOfApKQ7g56PxQIwDbzb5exhSe+MC4ArwBNdzl6T9Oi4ALAyRyUNPCIHPqA7bmYZQI6AEgL5FchrQF4EB74oD3zAnAVyGsw6IAuhrASzFM57gbwZypuhvBn6L4G8Gxz23aCZ+d5hF/AG4Ce7XwD7JN2qc5bXlg4ws4cLZb03nC4/AJwE3q9zulxrM2Rmfmp7sMvZH4Atkm5UhdAGADN7BDgNPN817keSJqvaUhfAr8Wsry3p/Gdgo6TLVQZuCsDMngLOAs+WjDcj6ckqdnidugB+A9ZEOvej7hck/dRr8CYAzOyZ4PyqyDizkrqP3KMm1QXg79sHCQf/BLZK+j4FoV8AZrYB+Bbw8I8VX5NSNs5rVxeAX2N9BryaMOC2P5f0ZaxOPwDM7OWwyPnCFyt+xfaapLu9orDzvBYAbxQygUeC/0V9BKZiM1EXgJm9BRwp+vSVPlY+Ad6WVCqzY41qA+h0ZGY7i+utT4GlCaOOBqPuza1TFUBF2D7bb0o6XnXW59brG0CIhk3AV8CyxOCeqrZL+mcOvJ6boXCD7CG9LdG3648JSd/047y3aQQgQHgO+A5IXWxeBDZLuh7aJAGEHO+LnS96sfJH6PNCv863AiA49DRwLqIROvb9qxVSr4CZeQo7U6z26xKOXQq645cmzrcGIEB4LBi+PmHUrGuFQjn+GKnTyfGrE324znC94bqjcWn8CnQtbsuBr4EXE5b9DayIPL/ZI8efB16S9Fdjz0MHrQIIkeBa4RjweltGhn58o+M5vtXPaFoHECB4v1P+3U9LED4Mu7xaOb7K2AsCoDNwRa2QsrNRjl90ACEaqmiFMlsb5/ihABAgVNEKc+1tJccPDYAAoYpW8Kqt5fihAlBRK7Sa44cOQIAQ0wqt5/ihBBAgPAjsBl4JRp4ADrWd44cWQBXDBlVnQXXAoJxoMk4G0ITe/6FtaQR0fc//+Ig7ejX1e4QYgLLv+UecA6W/R4gBKPuef9QBlP4eIQbg9x5nfKMIo/TKLAbgALBnFL1M2Dwt6b3u5zEArtQ+LjYmO4CVIw5iprjPPBUOVPzWal7JOmDEZ7ex+TkCGiMc8Q7GPgLuA2E6cVARaA3kAAAAAElFTkSuQmCC&link=https://www.tampermonkey.net/script_installation.php#url=https://github.com/ADecametre/testeur-dhoraires-polymtl/raw/refs/heads/main/script.user.js)](https://www.tampermonkey.net/script_installation.php#url=https://github.com/ADecametre/testeur-dhoraires-polymtl/raw/refs/heads/main/script.user.js)
<br>
<sup>Vous devez avoir l'extension de navigateur [Tampermonkey](https://www.tampermonkey.net/#download).</sup>

## Comment l'utiliser

### Après avoir reçu son horaire

1. Rendez-vous sur [le générateur d'horaires de l'AEP](https://beta.horaires.aep.polymtl.ca/).
2. Rentrez vos cours <u>en mettant tous les groupes en vert</u>.
3. Modifiez les paramètres (*Horaire personnel*, *Finir plus tôt*, etc.).
4. Cliquez sur `Générer les horaires`.
5. Recopier vos horaires préférés ici et conservez précieusement votre liste d'horaires&nbsp;:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Créer votre liste d'horaires](https://img.shields.io/badge/Cr%C3%A9er%20votre%20liste%20d'horaires-darkgreen?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABGhJREFUeF7tm8urHUUQxn+foBuNbnzhCx+YaNxERRQNoqgLEdQYg2Bc+x9IooGgIIqPf0C3ikJ8xKwUhAhqXIiKgpDEtySIIC6McaPgl1swI30mc073uffcc2c8U3A399RUV31dVd0987VYcNGCx88AwJABy0DA9nXAfcCtwPnAxcDpyzC1kkf+Ao4AvwIfAvskfTGtweISsB26W4GngQ3TDjQn/cPALuBtSS4ZswgA25cBrwE3lRjtgM4nwHZJP+V8yQJg+5ZAFDg3Z6xjv/8ObJP0wSS/JgJgO2r8feC0hpG/gXeqv6i7o5KiJucmtqPnXARcX/Wj+8f4eZek6BGtMhaAKu0/Bc5uPBnZ8JikH+YWbcFAtq9YasQvAFsa6r8BN0r6sc1MKwBVw4s6Smv+X2CnpBiks2J7x1ImPAOckjgZsWxua4zjANgG7GlEGbP+YmcjTxyzvRN4tuHrVkmRvSNyEgDV7B9sLHWxrMQS2BuxvReIvlDLQUkbSwCIpvJZohgNb6Ok73sTPWD7ciAmMm3g10r6Mo2jLQOeAnYnSnskPdSn4Gtfbb8BPJj4/qSkiO8/aQMg1s3bEp2HJb3eUwC2A68mvu+XdEcOgG+AKxOl9ZK+7SkAsWU/lPh+WNJVOQD+BM5IlNZJOt5TACKOiKeW45LW5QAYOUQs1Ux2u9xlcGxPjKetBwwAjKTIKmWA7XuAl2LFAh6V9O5qZFJnM8B2vMyIw0zIEUmXLBoAcym1LmfAAMCcek03V4Fcas6qH+TGWbNlMOfYAMCMEMgBPWRAE+gcYjOamDiv/z9XgWSHd+GswKrsHF3OjjEH9MxLoLHDmzEG0+8YBwDmfRq0fTfwcrLPn1UWxNkhDk3vTWNw7hlQ6lzOsVI7Ob3cODPvATmH6t9zjpXayenlxhkAGPYBDQRyKZNLudLfuzLOUAJDCQwlMIrAHGtz4V+K1jvG+rX4VDu8WTXbNWuCpQGsVC+X0QMALavAMSD9gNjnj6NnAn8kMR6TdNbI2+gWAIJtuT75/wZJ8cm8d2I7PoUHS6SWQ5KuzgGwH7g9UQrGZbBEeye2HwFeSRwvIkgsPEUmmOCfJ6j9A1zTN5aI7Sjjr4FTk1g2SfoqVwKxMjRpcnslPdCXGqiofkHlvTfxuYwmFw/YDk7gm42Ad0h6vg8g2H68Youm7m6RFKCMyCSq7MfAzYl2UGWfkPRcV0GoZj5YonGnIaXKHpC0uc3vSWTpS4EgS5/TeDBQDNrsd10CwnYw24LKm6Z9uBhk6Rsk/TwVAFUpjKPLR2PcV9Hlo2EGXX6uTDLbwQCLqzo1XT6u8KQNL0IIluudS9zAj8ZNVpYBVl2YeAs4r0szXuDLyi9M1INUdweCcZn2hAIf1kzlQHVlpjXtJy6D41yuGkxcRogGM7KdXLMwTx44lu9dkoIpXiTZEmizYntTcm3uguorUMouLRp8hUrRc+KD6S/JtbkRJniJ/WUBUGK4LzoDAH2ZqdXyc+Ez4AS3kl5fq3NcMAAAAABJRU5ErkJggg==&link=https://is.gd/0PQ2sT)](https://is.gd/0PQ2sT)

### Pendant la période de modification d'horaire

1. Copier votre liste d'horaires.
2. Ouvrez le module `Modifications de choix de cours` du [dossier étudiant](https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet).
3. Cliquez sur le bouton `Ouvrir le Testeur d'horaires :)`.
4. Collez votre liste d'horaires (ou autorisez la page à accéder au presse-papier).

Le Testeur essaiera un par un les horaires fournis jusqu'à ce qu'il trouve un horaire disponible. Il remplit automatiquement tous les champs du formulaire mais n'appuie pas sur le bouton `Enregistrer`.

<sup>Vous pouvez également voir toutes les opérations effectuées par le Testeur et la raison pour laquelle les horaires précédents ne sont pas retenus en ouvrant la console du navigateur (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> ou <kbd>F12</kbd>).</sup>



https://github.com/user-attachments/assets/0586492c-3f89-404a-822b-d4fbbaf2a29e



## Comment ça fonctionne

Lorsque la page `Modifications de choix de cours` du dossier étudiant charge, la liste des places disponibles de tous les groupes de tous les cours de l'université est chargée localement. La page utilise cette liste locale pour déterminer instantanément s'il reste de la place. C'est pourquoi le Testeur d'horaires est capable d'effectuer ses opérations instantanément.

Le Testeur d'horaires prend une liste de listes de cours sous forme JSON. Il remplit ensuite les champs du formulaire un par un. Si la page retourne un message contenant « plus de places » ou « n'existe pas », le Testeur passe à la liste de cours suivante, sinon, il s'arrête et affiche que le cours est disponible.

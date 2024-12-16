// ==UserScript==
// @name         Testeur d'horaires
// @version      2024-12-15
// @description  https://github.com/ADecametre/testeur-dhoraires-polymtl
// @author       ADécamètre
// @match        https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet*
// @match        https://beta.horaires.aep.polymtl.ca/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polymtl.ca
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    switch(window.location.origin){
        case 'https://dossieretudiant.polymtl.ca':
            if("sigle1" in document.forms[0]) testeur()
            else window.location.href = "https://dossieretudiant.polymtl.ca/WebEtudiant7/ValidationServlet"
            break
        case 'https://beta.horaires.aep.polymtl.ca':
            createurdeliste()
            break
    }

})();


function createurdeliste(){
    // Affichage de la liste des favoris
    document.body.insertAdjacentHTML('beforeend',
        `<style>
            .favoris-dialog-toggle {
                background-color: yellow;
                position: fixed;
                bottom: 0px;
                right: 0px;
                padding: 10px;
                z-index: 100;
                filter: drop-shadow(black 0px 0px 10px);
                border-radius: 10px;
            }
            #favoris-dialog {
                border-radius: 5px;
                border: 2px black solid;
                box-shadow: black 0 0 10px 2px;
            }
            #favoris-liste, #favoris-dialog-buttons>div { padding: 1em }
            #favoris-dialog::backdrop { backdrop-filter: blur(2px) }
            #favoris-dialog-buttons { position: sticky; top: 0px; z-index: 100; background-color:white; box-shadow: black 0 0 10px 2px }
            #favoris-dialog-buttons>div { display: flex; justify-content: space-evenly }
            #favoris-dialog-buttons button { padding: 0.5em; border-radius: 10px }
            #favoris-liste>hr { margin-block: 1em }
            #favoris-liste>div {
                display: grid;
                margin-bottom: 0.5em;
                grid-template-areas:
                    'horaire    up        down   '
                    'horaire supprimer  supprimer';
            }
            #favoris-liste b { font-size: 1.5em }
            #favoris-liste .horaire {
                grid-area: horaire;
                zoom: 60%;
            }
            #favoris-liste button:not(.favoris-dialog-toggle) { font-size: 2em; margin: auto; padding: 0.5em }
            #favoris-dialog button:disabled { opacity: 0.2 }
            #favoris-liste .up { grid-area: up }
            #favoris-liste .down { grid-area: down }
            #favoris-liste .supprimer { grid-area: supprimer }
            [data-tooltip] { display: flex; align-items: center; flex-direction:column }
            [data-tooltip]:hover::after {
                display: block;
                position: absolute;
                top: 80%;
                content: attr(data-tooltip);
                border: 1px solid black;
                border-radius: 5px;
                background: #eeee;
                padding: .25em;
                font-size: 0.75em;
            }
        </style>
        <button class="favoris-dialog-toggle" onclick="document.getElementById('favoris-dialog').showModal()">
            Afficher les favoris
        </button>
        <dialog id="favoris-dialog">
            <button class="favoris-dialog-toggle" onclick="document.getElementById('favoris-dialog').close()">
                Masquer les favoris
            </button>
            <div id="favoris-dialog-buttons">
                <div>
                    <button
                        data-tooltip="Ouvrir le dossier étudiant et utiliser le Testeur"
                        style="background-color:#0f0a"
                        onclick="copyFavoris().then(()=>{window.open('https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet?testeur', '_blank')})"
                    >
                        Tester
                    </button>
                    <button
                        data-tooltip="Copier la liste d'horaires sous forme de texte qui peut être utilisée dans le Testeur"
                        style="background-color:#00fa"
                        onclick="copyFavoris().then(()=>alert('Liste d\\'horaires copiée.\\nVous pouvez la coller dans le testeur.'))"
                    >
                        Copier
                    </button>
                    <button
                        data-tooltip="Ajouter des horaires depuis un fichier HTML"
                        style="background-color:#00fa"
                        onclick="importFavoris()"
                    >
                        Importer
                    </button>
                    <button
                        data-tooltip="Sauvegarder la liste d'horaires sous forme de fichier HTML"
                        style="background-color:#00fa"
                        onclick="exportFavoris()"
                    >
                        Exporter
                    </button>
                    <button
                        data-tooltip="Retirer tous les horaires"
                        style="background-color:#f00a"
                        onclick="if(confirm('Êtes-vous certain de vouloir retirer tous les favoris ?')){setFavoris([])}"
                    >
                        Supprimer
                    </button>
                    <button style="background-color:#555a" onclick="window.open('https://github.com/ADecametre/testeur-dhoraires-polymtl#comment-lutiliser', '_blank')">
                        ?
                    </button>
                </div>
                <hr />
            </div>
            <div id="favoris-liste"></div>
        </dialog>`)
    const dialog = document.getElementById("favoris-dialog");
    if(window.location.search == "?favoris") dialog.showModal()
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    // Fonctions de modification du localStorage
    window.getFavoris = ()=>JSON.parse(window.localStorage.getItem("favoris") || "[]")
    window.setFavoris = favoris=>window.localStorage.setItem("favoris", JSON.stringify(favoris))
    window.addFavori = favori=>{
        const favoris = window.getFavoris()
        favoris.push(favori)
        window.setFavoris(favoris)
    }
    window.removeFavori = favori=>{
        const favoris = window.getFavoris()
        favoris.splice(favoris.indexOf(favori), 1)
        window.setFavoris(favoris)
    }
    window.moveFavori = (i, new_i)=>{
        const favoris = window.getFavoris()
        favoris.splice(new_i, 0, ...favoris.splice(i, 1))
        window.setFavoris(favoris)
    }

    // Copie des favoris
    window.copyFavoris = async ()=>{
        const horaires = [...document.getElementById("favoris-liste").querySelectorAll(".cours")]
        const horaires_str = horaires.map(horaire=>{
            const liste_cours = [...horaire.querySelectorAll("tr")]
            return liste_cours.map(cours => {
                return [...cours.children].toSpliced(1,1).map(e=>e.innerText).filter(txt=>txt).join("/").replace(/[\s:]/g, '')
            }).join(",")
        }).join(";") // Exemple : INF1007/T1/L1,INF3005I/T1;INF1007/T1/L1,INF3005I/T1
        return navigator.clipboard.writeText(horaires_str)
    }

    // Importation/Exportation des favoris
    window.importFavoris = ()=>{
        let input = document.createElement('input');
        input.type = 'file'
        input.accept = '.html'
        input.onchange = ()=>{
            input.files.item(0).text()
                .then(text=>{
                    try {
                        if(!text.includes('<link rel="stylesheet" href="https://beta.horaires.aep.polymtl.ca/pkg/aep-schedule-website.css">')) throw new Error()
                        const horaires = document.createElement("div")
                        horaires.innerHTML = text
                        const liste_horaires = [...horaires.querySelectorAll(":scope > div")].map(horaire=>horaire.innerHTML.replace(/<\/?tbody>/g,""))
                        window.setFavoris([...new Set(window.getFavoris().concat(liste_horaires))])
                        setTimeout(()=>alert("Horaires importés"),10)
                    } catch {
                        alert("Impossible d'importer les horaires.\nAssurez-vous de fournir un fichier qui a été exporté depuis cet outil.")
                    }
                })
        };
        input.click()
    }
    window.exportFavoris = ()=>{
        const a = document.createElement('a');
        a.href = 'data:attachment/html,' + encodeURI(
            '<style>body{display:flex;flex-wrap:wrap;justify-content:center;}</style>'
            +'<link rel="stylesheet" href="https://beta.horaires.aep.polymtl.ca/pkg/aep-schedule-website.css">'
            +window.getFavoris().map((favori,i)=>`<div style="padding:2em">${favori}</div>`).join("<hr />")
        );
        a.target = '_blank';
        a.download = 'horaires-favoris.html';
        a.click();
    }

    // Synchronisation de la liste affichée avec celle enregistrée dans localStorage
    const localStorageSetItem = window.localStorage.setItem
    localStorage.setItem = function(key, value) {
        localStorageSetItem.apply(this, arguments)
        if (key == "favoris") document.dispatchEvent(new Event("favorisModifiés"))
    }
    function updateListe(){
        const favoris = window.getFavoris()

        document.getElementById("favoris-liste").innerHTML = favoris.map((e,i)=>
            `${i==0 ? "" : "<hr />"}
            <b>Horaire #${i+1}</b>
            <div>
                <div class="horaire">${e}</div>
                <button class="up" onclick="moveFavori(${i}, ${i-1})" ${i==0 ? "disabled" : ""}>
                    ⬆️
                </button>
                <button class="down" onclick="moveFavori(${i}, ${i+1})" ${i==favoris.length-1 ? "disabled" : ""}>
                    ⬇️
                </button>
                <button class="supprimer" onclick="if(confirm('Êtes-vous certain de vouloir retirer l\\'horaire #${i+1} ?')){removeFavori(getFavoris()[${i}])}">
                    ❌
                </button>
            </div>`).join('')
        ||
            `<p style='text-align:center;padding:2em'>
                <b>Aucun favori</b>
                <br />
                <small>Générez des horaires puis cliquez sur les boutons « Ajouter aux favoris » pour les faire apparaître ici.</small>
            </p>`

        document.querySelectorAll("#favoris-dialog-buttons button").forEach(button=>{
            if(!["Importer","?"].some(str => button.innerHTML.includes(str))) button.disabled = favoris.length === 0
        })
    }
    updateListe()
    window.updateListe = updateListe
    document.addEventListener("favorisModifiés", updateListe)

    // Affichage des boutons favori
    function creerBouton(coursHTML){
        const favoris = window.getFavoris()
        const isFavori = favoris.includes(coursHTML)
        const bouton = document.createElement('button')
        bouton.className = "favori"
        bouton.style.cssText = `background-color:#${isFavori ? "f0" : "0f"}0a;border-radius:5px;padding:5px`
        bouton.innerHTML = isFavori ? `Retirer des favoris <small>(Horaire #${favoris.indexOf(coursHTML)+1})</small>` : "Ajouter aux favoris"
        bouton.onclick = ()=>{
            if(!isFavori) window.addFavori(coursHTML)
            else window.removeFavori(coursHTML)
        }
        return bouton
    }
    function updateBoutons() {
        const listeCours = document.querySelectorAll('main>.right-panel>div:has(>.cours)')
        listeCours.forEach(e=>{
            const boutonExistant = e.querySelector('button.favori')
            const html = e.querySelector('.cours').outerHTML+e.querySelector('.schedule').outerHTML
            if(!boutonExistant){
                e.insertAdjacentElement('beforeend', creerBouton(html))
            }else{
                boutonExistant.replaceWith(creerBouton(html))
            }
        })
    }
    const observer = new MutationObserver(updateBoutons)
    observer.observe(document.querySelector('main>.right-panel'), {childList: true})
    document.addEventListener("favorisModifiés", updateBoutons)
}


async function testeur(){
    const form = document.forms[0]

    const searchParam = "?testeur"
    const active = window.location.search == "?testeur"

    form.insertAdjacentHTML('beforebegin',
        `<a href="https://beta.horaires.aep.polymtl.ca/?favoris" target="_blank">Ouvrir/Créer votre liste d'horaires</a>
        <input type="button"
            value="${active ? "Fermer" : "Ouvrir"} le testeur d'horaires :)"
            onclick="location.href=location.href.split('?')[0]${active?"":`+'${searchParam}'`}"
            style="background-color:#${active ? "f0" : "0f"}03"
        />
        ${active ? '<input type="button" value="Rafraîchir" onclick="location.reload()" style="background-color:#00f3" />' : ""}
        <a href="https://github.com/ADecametre/testeur-dhoraires-polymtl#comment-lutiliser" target="_blank">?</a>
        <table id="tests" style="width:100%"><thead><th style="width:max(10dvw,100px)"></th></thead><tbody /></table>
        <hr />`)
    if(!active) return

    async function wait(ms){
        return new Promise(res => setTimeout(res, ms))
    }


    // Chargement des choix de cours
    form.style.display = 'none'
    while(!window.cc) await wait(50)

    // Enregistrement de l'horaire initial pour pouvoir y revenir
    const initial_cc = JSON.parse(JSON.stringify(window.cc))
    function reset(){
        window.cc.copierChoix(initial_cc)
        form.reset()
        form.querySelector('input').onchange()
        for (const choix of window.cc){
            choix.modifie = false
        }
    }
    var affichage_initial_cc = []
    for (const [n_cours, cours] of Object.entries(window.ccTemp)){
        if(cours.sigle){
            affichage_initial_cc[parseInt(n_cours)] = (({ sigle, grTheo, grLab }) => ({ sigle, grTheo, grLab }))(cours)
        }
    }
    console.group("Horaire initial")
    console.table(affichage_initial_cc)
    console.groupEnd()
    const initial_sigles = affichage_initial_cc.map(cours=>cours.sigle)

    form.style.display = ''
    await wait(50)

    // Détection de la liste d'horaires dans le presse-papier
    var horaires // {sigle: string, grTheo: string?, grLab: string?}[][]
    let horaires_str = await navigator.clipboard.readText().catch(e=>e) // Exemple : INF1007/T1/L1,INF3005I/T1;INF1007/T1/L1,INF3005I/T1
    const cours_regex = /^([\w-]+)(?:\/(T)(\d+))?(?:\/(L)(\d+))?$/
    try {
        horaires = horaires_str.split(";").map(horaire=>horaire.split(",").map(cours=>{
            const m = cours_regex.exec(cours)
            let obj = {}
            for(let i = 0; i < m.length; i+=2){
                let key
                switch(m[i]){
                    case m[0]:
                        key = "sigle"
                        break
                    case "T":
                        key = "grTheo"
                        break
                    case "L":
                        key = "grLab"
                        break
                    default:
                        continue
                }
                obj[key] = m[i+1]
            }
            return obj
        }))
    } catch {
        if (confirm("Aucune liste d'horaire copiée.\nOuvrir le générateur d'horaires de l'AEP ?")){
            open("https://beta.horaires.aep.polymtl.ca/?favoris", "_blank")
        }
        return
    }

    // Désactivation des messages d'alerte pour ne pas interrompre le testeur
    const windowAlert = window.alert
    var error // Variable qui stocke les messages pour les cours non disponibles
    window.alert = function(message) {
        if (message.includes("plus de places") || message.includes("n'existe pas")) error = message
    }
    const windowConfirm = window.confirm
    window.confirm = ()=>{}
    function resetWindowPopups(){
        window.alert = windowAlert
        window.confirm = windowConfirm
    }


    console.log("%cTesteur d'horaires :)", 'font-size:2.5em')
    document.querySelector("#tests>tbody").insertAdjacentHTML("beforeend",
        [...Array(horaires.length).keys()].map(i => `<tr id="test-${i+1}"><td><b>Horaire #${i+1}</b></td></tr>`).join("")
    )
    // Loop horaires
    horaireLoop:
    for (const [n_horaire, horaire] of horaires.entries()){
        error = undefined
        console.groupEnd()
        console.group("Horaire #"+(n_horaire+1))
        console.table(horaire)
        let n_modifie = 0
        // Trier les cours selon l'ordre des cours de l'horaire initial (essentiel pour que les groupes de l'horaire initial soient pris en compte)
        horaire.sort((a, b) => initial_sigles.includes(a.sigle) ? initial_sigles.indexOf(a.sigle) - initial_sigles.indexOf(b.sigle) : 1);
        // Loop cours
        for (const [n_cours, cours] of horaire.entries()){
            n_modifie++
            // Loop propriétés (sigle, grTheo, grLab)
            for (const [input_name, input_value] of Object.entries(cours).filter(([,v])=>v)){
                // Modification du input
                let input = form[input_name.toLowerCase()+(n_cours+1)]
                if (input.value == input_value.toUpperCase() || (!isNaN(input_value) && input.value == parseInt(input_value))) continue
                input.value = input_value
                input.onchange()
                // Si un des cours n'est pas disponible
                if (error){
                    console.log("%c"+error, 'color:red')
                    document.querySelector("#test-"+(n_horaire+1)).insertAdjacentHTML("beforeend", `<td style="color:red">${error}</td>`)
                    await wait(100)
                    reset()
                    continue horaireLoop
                }
            }
        }
        // Si l'horaire est disponible
        const isHoraireDifferent = window.cc.some(cours => cours.modifie)
        while(n_modifie<window.cc.length){
            // Effacer les inputs restants
            n_modifie++
            let input = form["sigle"+n_modifie]
            input.value = ""
            input.onchange()
        }
        console.log("%cDisponible"+(isHoraireDifferent ? "" : " (horaire actuel)"), 'color:green')
        document.querySelector("#test-"+(n_horaire+1)).insertAdjacentHTML("beforeend", `<td style="color:green">Disponible${isHoraireDifferent ? "" : " (horaire actuel)"}</td>`)
        await wait(100)
        resetWindowPopups()
        alert(`L'horaire #${n_horaire+1} est disponible.${isHoraireDifferent ? " :)" : ""}
${isHoraireDifferent ? "- Pour conserver cet horaire, appuyez sur le bouton « Enregistrer »." : "Il s'agit du même horaire actuel."}
- Pour obtenir les résultats les plus récents, rafraîchissez la page.`)
        window.liste_des_conflits(form)
        break
    }

    // Si aucun horaire n'est disponible
    if(error){
        await wait(100)
        resetWindowPopups()
        alert("Aucun horaire n'est disponible. :(\nEssayez de rafraîchir la page ou d'entrer d'autres horaires.")
    }
}
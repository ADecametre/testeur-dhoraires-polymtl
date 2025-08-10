// ==UserScript==
// @name         Testeur d'horaires
// @version      2.0-beta.16
// @description  https://github.com/ADecametre/testeur-dhoraires-polymtl
// @author       ADécamètre
// @match        https://dossieretudiant.polymtl.ca/WebEtudiant7/PresentationHorairePersServlet
// @match        https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet*
// @match        https://beta.horaires.aep.polymtl.ca/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polymtl.ca
// @grant        none
// ==/UserScript==

const urlAEP = new URL("https://beta.horaires.aep.polymtl.ca/#favoris")
const urlModif = new URL("https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet")
const urlHelp = new URL("https://github.com/ADecametre/testeur-dhoraires-polymtl#comment-lutiliser")
const windowAEP = "Générateur d'horaire";

(async function() {
    'use strict';

    switch(location.hostname){
        case urlModif.hostname:
            if("sigle1" in document.forms[0]) testeur()
            else if (location.pathname == "/WebEtudiant7/PresentationHorairePersServlet") creerInterfaceTesteur()
            else location.pathname = "/WebEtudiant7/ValidationServlet"
            break
        case urlAEP.hostname:
            gestionnaireDeFavoris()
            break
    }

})();

function creerInterfaceTesteur(active = null){
    const titre = document.querySelector("form>.row:has(h3)")
    const disabled = active === null
    const isFormulaireReset = [...document.forms[0].elements].every(e=>!["sigle","gr"].some(t=>e.name.startsWith(t))||e.value==e.defaultValue);
    titre.insertAdjacentHTML('beforebegin',
        `<div style="${disabled
            ? "position:relative;top:-10px"
            : "position:sticky;top:0px;background-color:white;z-index:100;box-shadow:white 0px -10px 0 10px;white-space:nowrap;width:fit-content"
        }">
            ${disabled ? "" :
                `<input type="button"
                    value="${active ? "Fermer" : "Ouvrir"} le testeur d'horaires :)"
                    style="background-color:#${active ? "f0" : "0f"}03"
                    onclick="${!active ?
                        `if(opener?.window){
                            window.open('${urlAEP}', \`${windowAEP}\`)
                        }else{
                            location.assign('${urlAEP}')
                        }`
                        :
                        `location.assign('${urlModif}')`
                    }"
                />`
            }
            ${!disabled && !active ? "" :
                `<a onclick="
                    if(opener?.window){
                        window.open('${urlAEP}', \`${windowAEP}\`)
                    }else{
                        ${disabled ? "window.open" : "location.assign"}('${urlAEP}')
                    }"
                style="background-color:#ff03">
                    Modifier votre liste d'horaires favoris
                </a>`
            }
            ${active ? '<a onclick="location.reload()" style="background-color:#00f3">Rafraîchir</a>' : ""}
            <a href="${urlHelp}" target="_blank">?</a>
        </div>
        ${disabled ? "" : '<table id="tests" style="width:max-content"><thead><th style="width:max(10dvw,100px)"></th></thead><tbody /></table>'}
        <hr />
        <small id="erreur-autocomplete" style="color:red${active || isFormulaireReset ? ";display:none" : ""}">
            Votre navigateur a rempli automatiquement le formulaire, ce qui brise le fonctionnement du site.
            <a href="https://github.com/ADecametre/testeur-dhoraires-polymtl/issues/15"
                target="_blank" style="background:none;border:none;font-size:0.5em">En savoir plus</a>
            <br/>
            Cliquez pour remettre votre horaire actuel.
        </small>
        <br/>
        <input type="reset" value="Réinitialiser"
            onclick='setTimeout(()=>initialiser(),250);document.getElementById("erreur-autocomplete").style.display="none"'>
        `)
        if(!disabled) document.querySelector(".container").style = "min-width: min(768px,95dvw)"
}


function gestionnaireDeFavoris(){
    window.name = windowAEP
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
                align-self: center;
                justify-self: center;
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
                        onclick="testerFavoris()"
                    >
                        Tester
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
                    <button style="background-color:#555a" onclick="open('${urlHelp}', '_blank')">
                        ?
                    </button>
                </div>
                <hr />
            </div>
            <div id="favoris-liste"></div>
        </dialog>`)
    const dialog = document.getElementById("favoris-dialog");
    if(location.hash == urlAEP.hash) dialog.showModal()
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    // Fonctions de modification du localStorage
    window.getFavoris = ()=>JSON.parse(localStorage.getItem("favoris") || "[]")
    window.setFavoris = favoris=>{
        localStorage.setItem("favoris", JSON.stringify(favoris))
        updateListe()
        updateBoutons()
    }
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

    window.testerFavoris = async ()=>{
        const horaires = [...document.getElementById("favoris-liste").querySelectorAll(".horaire")]
        const horaires_str = horaires.map(horaire => horaire.dataset.horaire).join("*") // Exemple : INF1007_T1_L1.INF3005I_T1*INF1007_T1_L1.INF3005I_T1

        const url = urlModif+'#tests='+encodeURIComponent(horaires_str)
        if (window.testeur && !window.testeur.closed) {
            window.testeur.focus()
            window.testeur.location.replace(url)
        }
        else window.testeur = open(url, '_blank')
    }
    function scrollToHoraireDisponible() {
        if(!document.hidden) window.horaireDisponible?.scrollIntoView({behavior:"smooth", block:"center"})
    }
    window.addEventListener("message", event=>{
        if(event.origin == urlModif.origin){
            const horaire_disponible = event.data
            if (horaire_disponible) {
                const horaires = [...document.getElementById("favoris-liste").querySelectorAll(".horaire")]
                window.horaireDisponible = horaires.find(horaire => horaire.dataset.horaire == horaire_disponible)
                scrollToHoraireDisponible()
            } else window.horaireDisponible = undefined
        }
    })
    window.addEventListener("visibilitychange", scrollToHoraireDisponible)

    // Importation/Exportation des favoris
    window.importFavoris = ()=>{
        let input = document.createElement('input');
        input.type = 'file'
        input.accept = '.html'
        input.onchange = ()=>{
            input.files.item(0).text()
                .then(html=>{
                    try {
                        const horaires = document.createElement("div")
                        horaires.innerHTML = html
                        if(!horaires.querySelector(".cours")) throw new Error()
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

        const horaires = [...document.getElementById("favoris-liste").querySelectorAll(".horaire")]
        horaires.forEach(horaire=>{
            const liste_cours = [...horaire.querySelectorAll("tr")]
            const code_horaire = liste_cours.map(cours => {
                const { 0: sigle, 2: grTheo, 3: grLab } = [...cours.children].map(e => e.innerText)
                return [sigle, grTheo, grLab].filter(txt=>txt).join("_").replace(/[\s:]/g, '')
            }).join(".")
            horaire.dataset.horaire = code_horaire
        })

        document.querySelectorAll("#favoris-dialog-buttons button").forEach(button=>{
            if(!["Importer","?"].some(str => button.innerHTML.includes(str))) button.disabled = favoris.length === 0
        })
    }
    updateListe()

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
}


async function testeur(){
    window.addEventListener("hashchange", () => { location.reload() })

    const horaires_str = /#tests=(.+)/.exec(location.hash)?.at(1) // Exemple : INF1007_T1_L1.INF3005I_T1*INF1007_T1_L1.INF3005I_T1
    const active = horaires_str != undefined

    creerInterfaceTesteur(active)

    if(!active) return

    var horaires // {sigle: string, grTheo: string?, grLab: string?}[][]
    const cours_regex = /^([a-zA-Z0-9-]+)(?:_(T)(\d+))?(?:_(L)(\d+))?$/
    try {
        horaires = horaires_str.split("*").map(horaire=>horaire.split(".").map(cours=>{
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
        alert("Liste d'horaires invalide")
        if (opener?.window) close()
        else location.replace(urlAEP)
        return
    }

    async function wait(ms){
        return new Promise(res => setTimeout(res, ms))
    }

    // Chargement de l'horaire initial
    const form = document.forms[0]

    // Undo autocomplétion Firefox
    form.reset()
    window.initialiser()

    form.style.display = 'none'
    while(!window.cc) await wait(50)

    // Enregistrement de l'horaire initial pour pouvoir y revenir
    const initial_cc = JSON.parse(JSON.stringify(window.cc))
    function reset(){
        window.cc.copierChoix(initial_cc)
        form.reset()
        form.querySelector('input[type="text"]').onchange()
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

    // Désactivation des messages d'alerte pour ne pas interrompre le testeur
    const windowAlert = alert
    var error // Variable qui stocke les messages pour les cours non disponibles
    window.alert = message => {
        if (message.includes("plus de places") || message.includes("n'existe pas")) error = message
    }
    const windowConfirm = confirm
    window.confirm = ()=>{}
    function resetWindowPopups(){
        window.alert = windowAlert
        window.confirm = windowConfirm
    }


    console.log("%cTesteur d'horaires :)", 'font-size:2.5em')
    // Affichage de la liste d'horaires
    document.querySelector("#tests>tbody").insertAdjacentHTML("beforeend",
        [...Array(horaires.length).keys()].map(i =>{
            const texte = `Horaire #${i+1}`
            return `<tr id="test-${i+1}"><td><b title="${texte} : ${horaires_str.split("*")[i]}">${texte}</b></td></tr>`
        }).join("")
    )

    // Loop horaires
    const fake_delay = Math.min(1000/horaires.length, 200)
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
                    const affichageTest = document.querySelector("#test-"+(n_horaire+1))
                    affichageTest.insertAdjacentHTML("beforeend", `<td style="color:red">${error}</td>`)
                    affichageTest.nextSibling?.scrollIntoView(false)
                    await wait(fake_delay)
                    reset()
                    continue horaireLoop
                }
            }
        }
        // Si l'horaire est disponible
        for(let i = window.cc.length-1; i > n_modifie; i--){
            // Effacer les inputs restants
            let input = form["sigle"+i]
            if(input.value == "") continue;
            input.value = ""
            input.onchange()
        }
        const isHoraireDifferent = window.cc.some(cours => cours.modifie)
        console.log("%cDisponible"+(isHoraireDifferent ? "" : " (horaire actuel)"), 'color:green')
        const affichageTest = document.querySelector("#test-"+(n_horaire+1))
        affichageTest.insertAdjacentHTML("beforeend", `<td style="color:green">Disponible${isHoraireDifferent ? "" : " (horaire actuel)"}</td>`)
        affichageTest.style = "position:sticky;top:54px;background-color:#dfd;box-shadow:#dfd 0 0 10px 5px;font-weight:bold"

        await wait(100)
        window.opener?.postMessage(horaires_str.split("*")[n_horaire], urlAEP.origin)
        window.onbeforeunload = () => { window.opener?.postMessage(null, urlAEP.origin) }
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
        alert("Aucun horaire n'est disponible. :(\nEssayez de rafraîchir la page ou de modifier votre liste d'horaires.")
    }

    await wait(100)
    form.sigle1.scrollIntoView({behavior: "smooth", block: "center"})
}
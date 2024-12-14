// ==UserScript==
// @name         Testeur d'horaires
// @namespace    http://tampermonkey.net/
// @version      2024-12-14
// @description  https://github.com/ADecametre/testeur-dhoraires-polymtl
// @author       ADécamètre
// @match        https://dossieretudiant.polymtl.ca/WebEtudiant7/ChoixCoursServlet*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polymtl.ca
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const form = document.forms[0]

    const searchParam = "?testeur"
    const active = window.location.search == "?testeur"

    form.insertAdjacentHTML('beforebegin',
`<a href="https://is.gd/0PQ2sT" target="_blank">Créer votre liste d'horaires</a>
<input type="button"
       value="${active ? "Fermer" : "Ouvrir"} le testeur d'horaires :)"
       onclick="location.href=location.href.split('?')[0]${active?"":`+'${searchParam}'`}"
       style="background-color:#${active ? "f0" : "0f"}03"
/>
${active ? '<input type="button" value="Rafraîchir" onclick="location.reload()" style="background-color:#00f3" />' : ""}
<hr />`
                           )
    if(!active) return

    // Wait
    async function wait(ms){
        return new Promise(res => setTimeout(res, ms))
    }

    // Custom Error
    /*class AvailabilityError extends Error {
        constructor(message) {
            super(message);
            this.name = 'AvailabilityError';
        }
    }*/

    // Catch alert
    const windowAlert = window.alert
    var error
    window.alert = function(message) {
        //if (message.includes("plus de places")) throw new AvailabilityError(message)
        //return windowAlert(message);
        if (message.includes("plus de places") || message.includes("n'existe pas")) error = message
    }
    const windowConfirm = window.confirm
    window.confirm = ()=>{}
    function resetWindowPopups(){
        window.alert = windowAlert
        window.confirm = windowConfirm
    }


    // Load cc
    form.style.display = 'none'
    while(!window.cc) await wait(50)
    const initial_cc = JSON.parse(JSON.stringify(window.cc))
    function reset(){
        window.cc.copierChoix(initial_cc)
        form.reset()
        form.querySelector('input').onchange()
        for (const choix of window.cc){
            choix.modifie = false
        }
    }
    //window.initial_cc = JSON.parse(JSON.stringify(window.cc))
    //window.affichage_initial_cc = JSON.parse(JSON.stringify(window.initial_cc))
    /*Object.entries(window.affichage_initial_cc)
        .filter(([k,v])=>isNaN(k)||v.sigle)
        .forEach(([k,v])=>delete window.affichage_initial_cc[k])
        .forEach(([k,v])=>Object.entries(v).forEach())*/
    var affichage_initial_cc = []
    for (const [n_cours, cours] of Object.entries(window.ccTemp)){
        if(cours.sigle){
            affichage_initial_cc[parseInt(n_cours)] = (({ sigle, grTheo, grLab }) => ({ sigle, grTheo, grLab }))(cours)
        }
    }
    console.group("Horaire initial")
    console.table(affichage_initial_cc)
    console.groupEnd()
    //console.table(Object.values(initial_cc).filter(key=>!isNaN(key)))
    form.style.display = ''
    await wait(50)


    var horaires // {sigle: string, grTheo: string?, grLab: string?}[][]
    let horaires_str = await navigator.clipboard.readText().catch(e=>e) + " "
    do {
        if (!horaires_str) return
        try {
            horaires = JSON.parse(horaires_str)
            horaires[0][0]
        } catch {
            alert("Format invalide")
            horaires = undefined
            horaires_str = prompt("Veuillez entrer votre liste d'horaires.\n(Si vous n'avez pas de liste d'horaire, cliquer sur le bouton « Créer votre liste d'horaires ».)")
        }
    } while (!horaires)

    // Loop combinaisons
    console.log("%cTesteur d'horaires :)", 'font-size:2.5em')
    horaireLoop: for (const [n_horaire, horaire] of horaires.entries()){
        error = undefined
        //console.log("%cHoraire #"+(n_horaire+1), 'font-size:20px')
        console.groupEnd()
        console.group("Horaire #"+(n_horaire+1))
                console.table(horaire)
        //try{
        for (const [n_cours, cours] of horaire.entries()){
            for (const [input_name, input_value] of Object.entries(cours).filter(([k,v])=>v)){
                let input = form[input_name.toLowerCase()+(n_cours+1)]
                if (input.value == input_value.toUpperCase() || (!isNaN(input_value) && input.value == parseInt(input_value))) continue
                input.value = input_value
                input.onchange()
                if (error){
                    console.log("%c"+error, 'color:red')
                    reset()
                    continue horaireLoop
                    //await wait(1000)
                }
            }
        }
        await wait(10)
        const isHoraireDifferent = window.cc.some(cours => cours.modifie)
        console.log("%cDisponible"+(isHoraireDifferent ? "" : " (horaire actuel)"), 'color:green')
        resetWindowPopups()
        alert(`L'horaire #${n_horaire+1} est disponible.${isHoraireDifferent ? " :)" : ""}
${isHoraireDifferent ? "- Pour conserver cet horaire, appuyez sur le bouton « Enregistrer »." : "Il s'agit du même horaire actuel."}
- Pour obtenir les résultats les plus récents, rafraîchissez la page.`)
        window.liste_des_conflits(form)
        break
        /*}catch(e){
            if (e instanceof AvailabilityError) {
                //window.cc = window.initial_cc
                await wait(1000)
            }
            else throw e
        }*/
    }

    if(error){
        resetWindowPopups()
        alert("Aucun horaire n'est disponible. :(\nEssayez de rafraîchir la page ou d'entrer d'autres horaires.")
    }


})();
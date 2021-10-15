//Carregar dados dinâmicos (AJAX)
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var content = document.getElementById("content");

    if(ajax.readyState == 4 && ajax.status == 200){

        var data_json =  JSON.parse(ajax.responseText);

        if(data_json.length == 0){

            content.innerHTML = '<div class="alert alert-warning" role="alert">Nenhuma música cadastrada.</div>';

        }else{
            var html_content = "";

            for(var i = 0; i <data_json.length; i++){

                html_content += '<div class="row title_cat"><div class="col-12"><h2>'+data_json[i].cargo+'</h2></div></div><div class="row">';

                if(data_json[i].pessoa.length == 0){
                    html_content += '<div class="col-12"><div class="alert alert-warning" role="alert">Nenhuma música cadastrada.</div></div>';
                }else{
                    
                    for(var j = 0; j < data_json[i].pessoa.length; j++){
                        html_content += card_pessoa(data_json[i].pessoa[j].nome,data_json[i].pessoa[j].imagem,data_json[i].pessoa[j].posicao,data_json[i].pessoa[j].url_linkedin,data_json[i].pessoa[j].experiencia,data_json[i].pessoa[j].formacao,data_json[i].pessoa[j].habilidades);
                    }

                }

                html_content +="</div>";
            }
            cache_dinamico(data_json);
            content.innerHTML = html_content;
        }
    }
}

var card_pessoa = function(nome, imagem, posicao, url_linkedin, experiencia, formacao, habilidades){


    return '<div class="col-md-4">'+       
                '<div class="card">'+
                    '<img src="'+imagem+'" class="img_profile">'+
                    '<h5 class="card-header">'+nome+'</h5>'+
                    '<div class="card-body" style="text-align: center;">'+
                        '<h5 class="card-title">'+posicao+'</h5>'+
                        '<p class="card-text">Largo conhecimento técnico e liderança.</p>'+
                        '<a href="#" onClick="javascript:dadosModal(\''+nome+'\', \''+experiencia+'\', \''+formacao+'\', \''+habilidades+'\');" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#fullProfile">Sobre</a>&nbsp;'+
                        '<a href="'+url_linkedin+'" target="_blank" class="btn btn-info">Linked-in</a>'+
                    '</div>'+
                '</div>'+
            '</div>';

}

var dadosModal = function(nome, experiencia, formacao, habilidades){

    console.log(nome);

    document.getElementById('fullProfile_Title').innerHTML = nome;
    document.getElementById('fullProfile_Experiencia').innerHTML = experiencia;
    document.getElementById('fullProfile_Formacao').innerHTML = formacao;
    document.getElementById('fullProfile_Habilidade').innerHTML = habilidades;

}

//Cache Dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        caches.delete('connect-app-dinamico').then(function(){

            if(data_json.length > 0){

                var files = ['dados.json'];

                for(var i = 0; i <data_json.length; i++){
                    for(var j = 0; j < data_json[i].pessoa.length; j++){

                        if(files.indexOf(data_json[i].pessoa[j].imagem) == -1){
                            files.push(data_json[i].pessoa[j].imagem);
                        }
                    
                    }
                }

            }

            caches.open('connect-app-dinamico').then(function (cache){

                cache.addAll(files).then(function(){

                    console.log("Cache dinâmico realizado com sucesso!");

                });

            });

        });

    }
}

//Interceptar o Prompt de Instalação do PWA

let disparoInstalacao = null;
const btInstall = document.getElementById('btInstall');

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação");
            }else{
                console.log("Usuário NÃO fez a instalação");
            }

        });

    });

}
window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt){
    disparoInstalacao = evt;
}
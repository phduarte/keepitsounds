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

                html_content += '<div class="row title_cat"><div class="col-12"><h2>'+data_json[i].estilo+'</h2></div></div><div class="row">';

                if(data_json[i].musicas.length == 0){
                    html_content += '<div class="col-12"><div class="alert alert-warning" role="alert">Nenhuma música cadastrada.</div></div>';
                }else{
                    
                    for(var j = 0; j < data_json[i].musicas.length; j++){
                        var musica = data_json[i].musicas[j];
                        html_content += card_musica(musica.artista,musica.foto,musica.titulo,musica.video,musica.letra);
                    }
                }

                html_content +="</div>";
            }
            cache_dinamico(data_json);
            content.innerHTML = html_content;
        }
    }
}

var card_musica = function(nome, foto, titulo, video, letra){
    return '<div class="col-md-4">'+       
                '<div class="card">'+
                    '<img src="'+foto+'" class="img_profile">'+
                    '<h5 class="card-header">'+nome+'</h5>'+
                    '<div class="card-body" style="text-align: center;">'+
                        '<h5 class="card-title">'+titulo+'</h5>'+
                        '<p class="card-text">&nbsp;</p>'+
                        '<a href="#" onClick="javascript:dadosModal(\''+nome+'\', \''+letra+'\');" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#fullProfile">Letra</a>&nbsp;'+
                        '<a href="'+video+'" target="_blank" class="btn btn-info">Ouça</a>'+
                    '</div>'+
                '</div>'+
            '</div>';

}

var dadosModal = function(nome, letra){
    console.log(nome);
    document.getElementById('fullProfile_Title').innerHTML = nome;
    document.getElementById('fullProfile_Experiencia').innerHTML = letra;
}

// Cache Dinâmico
var cache_dinamico = function(data_json){

    if('caches' in window){

        caches.delete('kiss-app-static-files').then(function(){

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

            caches.open('kiss-app-static-files').then(function (cache){

                cache.addAll(files).then(function(){
                    console.log("Cache dinâmico realizado com sucesso!");
                });
            });
        });
    }
}

// Interceptar o Prompt de Instalação do PWA

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
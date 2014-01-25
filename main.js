// JavaScript Document

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

function watchPosition() {
	var options = { frequency: 1000 };
	watchID = navigator.geolocation.watchPosition(posicion_ok, ErrorUbicacion, options);
}
function ErrorUbicacion(error) {
	var texto = 'No se ha podido obtener la ubicación.';
	msg(texto);
	lat = 0;
	lon = 0;
}
function posicion_ok(position){
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	//msg('pos('+lat+','+lon+')');
}

var lat = 0;
var lon = 0;
watchID = null;

// device APIs are available
var datos_equipo = '';
function onDeviceReady() {
	datos_equipo = '&model=' + device.model + 
								'&cordova=' + device.cordova + 
								'&platform=' + device.platform + 
								'&uuid=' + device.uuid + 
								'&version=' + device.version;
	watchPosition();
}


function msg(texto){
	if(typeof(navigator.notification)=='undefined'){
		alert(texto);
	}else{
		navigator.notification.alert(
				texto,  				// message
				alertDismissed, // callback
				'Hito Demo',  // title
				'Listo!'        // buttonName
		);
	}
	console.log(texto);
} 

function alertDismissed() {
    // do something
		console.log('ejecuto la funsión alertDismissed');
}


function ahora(){
	var currentdate = new Date();
	var ano =  currentdate.getFullYear();
	var mes = currentdate.getMonth()+1;
	var dia = currentdate.getDate();
	var hora = currentdate.getHours();
	var minuto = currentdate.getMinutes();
	var segundo = currentdate.getSeconds();
	if(mes<10)
		mes = '0' + mes;
	if(dia<10)
		dia = '0' + dia;
	if(hora<10)
		hora = '0' + hora;
	if(minuto<10)
		minuto = '0' + minuto;
	if(segundo<10)
		segundo = '0' + segundo;
	var datetime =  ano + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundo;
	return datetime;
}



function enviar(id,valor){
	var vuelo = $("#vuelo").val();
	url = url_master + "?app=hitodemo&json=" + JSON.stringify(vuelos)+ '&lat=' + lat + '&lon=' + lon + datos_equipo;
	
	$.ajax({
		url: url,
		beforeSend: function() { estado('enviando información...'); }, //Show spinner: $.mobile.showPageLoadingMsg();
		complete: function() { estado('conectividad satisfactoria'); }, //Hide spinner: $.mobile.hidePageLoadingMsg();
		dataType: "jsonp",
		async: true,
		success: function (result) {
			//console.log(result);
			//var nombre = result['nombre'];
			//precio_despacho = result['precio1'];
			//var texto = 'Sector: ' + nombre;
			//msg(texto);
			//$.mobile.changePage("#pagina03");
			//$("#valor_despacho").html(FormatoDinero(precio_despacho));
		},
		error: function (request,error) {
			var texto = 'Error conectando con el servidor!';
			msg(texto);
		}
	});
}

function estado(text){
	$("#estado").text(text);
}

function hit_now(check,id){
	if($("#vuelo" + check).val()==''){
		$("#vuelo" + check).focus();
		msg('Debe ingresar el vuelo');
	}else{
		var id_vuelo = $("#vuelo" + check).val()*1;
		var now = ahora();
		if(typeof(vuelos[id_vuelo])=='undefined'){
			// No existe el vuelo en el cache
			vuelos[id_vuelo] = {};
			vuelos[id_vuelo]['orden_vuelo'] = orden_vuelo;
			orden_vuelo++;
		}
		console.log(vuelos);
		if($("#campo_vuelo" + check).css('display')=='block'){
			$("#campo_vuelo" + check).css('display','none');
			$("#vuelo_txt" + check).html('<label>Vuelo</label><blockquote><b>'+id_vuelo+'</b></blockquote>');
		}
		if(typeof(vuelos[id_vuelo]['hito' + id])=='undefined'){
			// Si no existe ese hito para este vuelo, lo crea
			vuelos[id_vuelo]['vuelo'] = id_vuelo;
			vuelos[id_vuelo]['hito' + id] = now;
			lista_tiempos[id] = now;
			enviar(id,now);
			//console.log(lista_tiempos);
			$("#tiempo" + id).html('Validado: ' + now);
			$("#pulsador" + id).attr("onclick","");
			$("#pulsador" + id).buttonMarkup({ icon: "check" });
			$("#pulsador" + id).css("background-color", "#D1E2FF");
		}else{
			$("#tiempo" + id).html('Inv&aacute;lido.');
			$("#pulsador" + id).attr("onclick","");
			$("#pulsador" + id).buttonMarkup({ icon: "forbidden" });
		}
		
	}
}

function crea_tabla(){
	var matriz = [];
	// Borra el contenido
	$("#tabla_vuelos").html('');
	// Recorre el arreglo vuelos - ordena
	$.each(vuelos, function( key, value ) {
		// Escribe en html cada linea
		cadena = '<li><a href="#" onclick="ver_vuelo('+key+')">'+ value['vuelo'] + '</a></li>';
		// guarda la linea en una matriz temporal.
		matriz[value['orden_vuelo']] = (cadena);
	});
	// Escribe la tabla al revés
	for(i=matriz.length-1;i>-1;i--){
		$("#tabla_vuelos").append(matriz[i]);
	}
	$('#tabla_vuelos').listview('refresh');
}

function ver_vuelo(id){
	//msg('Vuelo: ' + vuelos[id]['vuelo']);
	$("#detalles_vuelo").html('');
	$("#detalles_vuelo").append('<h2>' + vuelos[id]['vuelo'] + '</h2>');
	$.each(lista_hits, function( hito, value ) {
		if(typeof(vuelos[id]['hito' + hito])=='undefined'){
			$("#detalles_vuelo").append('<h4>' + lista_hits[hito] + '</h4>');
			$("#detalles_vuelo").append('<blockquote><p>-</p></blockquote>');
		}else{
			$("#detalles_vuelo").append('<h4>' + lista_hits[hito] + '</h4>');
			$("#detalles_vuelo").append('<blockquote><p>' + vuelos[id]['hito' + hito] + '</p></blockquote>');			
		}
	});
	$.mobile.changePage("#detalles");
}
	

$("#inicio").live('pagebeforeshow', function() {
	crea_tabla();
});


$("#check1").live('pagebeforeshow', function() {
	lista_tiempos = [];
	$('#lista1').html('<li class="ui-field-contain"><span id="vuelo_txt1"></span><div id="campo_vuelo1"><label for="vuelo1">Vuelo:</label><input name="vuelo1" id="vuelo1" type="tel" value="" data-clear-btn="true"></div></li>');
	for(id=0;id<=2;id++){
		$('#lista1').append('<li><a href=""><h3>'+lista_hits[id]+'</h3><p id="tiempo'+id+'">-</p></a><a href="" onClick="hit_now(1,'+id+')" data-theme="a" data-icon="clock" id="pulsador'+id+'">texto</a></li>')
	}
	$('#lista1').listview('refresh');
	
  $("#vuelo1").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        //$("#errmsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
});

$("#check2").live('pagebeforeshow', function() {
	lista_tiempos = [];
	$('#lista2').html('<li class="ui-field-contain"><span id="vuelo_txt2"></span><div id="campo_vuelo2"><label for="vuelo2">Vuelo:</label><input name="vuelo2" id="vuelo2" type="tel" value="" data-clear-btn="true"></div></li>');
	for(id=3;id<=4;id++){
		$('#lista2').append('<li><a href=""><h3>'+lista_hits[id]+'</h3><p id="tiempo'+id+'">-</p></a><a href="" onClick="hit_now(2,'+id+')" data-theme="a" data-icon="clock" id="pulsador'+id+'">texto</a></li>')
	}
	$('#lista2').listview('refresh');
	
  $("#vuelo2").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        //$("#errmsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
});

var orden_vuelo = 1;
var url_master = 'http://www.exefire.com/log/';
var vuelos = {};
var lista_tiempos = [];
var lista_hits = [];
lista_hits[0] = 'Llegada Grupo';
lista_hits[1] = 'Env&iacute;o 1<sup>er</sup> Carro';
lista_hits[2] = 'Env&iacute;o &Uacute;ltimo Carro';
lista_hits[3] = 'Llegada 1<sup>er</sup> Carro';
lista_hits[4] = 'Llegada 2<sup>o</sup> Carro';
	


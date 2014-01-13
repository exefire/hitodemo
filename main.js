// JavaScript Document

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
var datos_equipo = '';
function onDeviceReady() {
		datos_equipo = '&model=' + device.model + 
									'&cordova=' + device.cordova + 
									'&platform=' + device.platform + 
									'&uuid=' + device.uuid + 
									'&version=' + device.version;
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
	url = url_master + "?app=hitodemo&json=" + JSON.stringify(vuelos) + datos_equipo;
	
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

function hit_now(id){
	if($("#vuelo").val()==''){
		$("#vuelo").focus();
		msg('Debe ingresar el vuelo');
	}else{
		var now = ahora();
		if(typeof(vuelos[id_vuelo])=='undefined'){
			vuelos[id_vuelo] = {};
			$("#campo_vuelo").css('display','none');
			$("#vuelo_txt").html('<label>Vuelo</label><blockquote><b>'+$("#vuelo").val()+'</b></blockquote>');
		}
		vuelos[id_vuelo]['vuelo'] = $("#vuelo").val();
		vuelos[id_vuelo]['hito' + id] = now;
		lista_tiempos[id] = now;
		enviar(id,now);
		//console.log(lista_tiempos);
		$("#tiempo" + id).html('Validado: ' + now);
		$("#pulsador" + id).attr("onclick","");
		$("#pulsador" + id).buttonMarkup({ icon: "check" });
	}
	console.log(vuelos);
}

function crea_tabla(){
	var matriz = [];
	// Borra el contenido
	$("#tabla_vuelos").html('');
	// Recorre el arreglo vuelos
	$.each(vuelos, function( key, value ) {
		// Escribe en html cada linea
		cadena = '<li><a href="#" onclick="ver_vuelo('+key+')">'+ value['vuelo'] + '</a></li>';
		// guarda la linea en una matriz temporal.
		matriz.push(cadena);
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


$("#lista").live('pagebeforeshow', function() {
	$("#vuelo").val('');
	$("#campo_vuelo").css('display','block');
	$("#vuelo_txt").html('');
	id_vuelo++;
	console.log('id_vuelo: ' + id_vuelo);
	lista_tiempos = [];
	for(id=0;id<=4;id++){
		$("#tiempo" + id).html('-');
		$("#pulsador" + id).attr("onclick","hit_now('" + id + "')");
		$("#pulsador" + id).buttonMarkup({ icon: "clock" });
	}
});

var url_master = 'http://www.exefire.com/log/';
var vuelos = {};
var lista_tiempos = [];
var lista_hits = [];
var id_vuelo = 0;
lista_hits[0] = 'Llegada Grupo';
lista_hits[1] = 'Env&iacute;o 1<sup>er</sup> Carro';
lista_hits[2] = 'Env&iacute;o &Uacute;ltimo Carro';
lista_hits[3] = 'Llegada 1<sup>er</sup> Carro';
lista_hits[4] = 'Llegada 2<sup>o</sup> Carro';
	


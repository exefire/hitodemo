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
	url = url_master + "?app=hitodemo&vuelo=" + vuelo + "&id="+id + "&valor="+valor + datos_equipo;
	
	$.ajax({
		url: url,
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
		complete: function() { $.mobile.hidePageLoadingMsg(); }, //Hide spinner
		dataType: "jsonp",
		async: true,
		success: function (result) {
			console.log(result);
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

function hit_now(id){
	if($("#vuelo").val()==''){
		$("#vuelo").focus();
		msg('Debe ingresar el vuelo');
	}else{
		var now = ahora();
		enviar(id,now);
		lista_tiempos[id] = now;
		console.log(lista_tiempos);
		$("#tiempo" + id).html('Validado: ' + now);
		//$('#pulsador' + id).attr("data-theme", "e").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");	
		$("#pulsador" + id).attr("onclick","");
		$("#pulsador" + id).html('');
	}
}

var url_master = 'http://www.exefire.com/log/';
var lista_tiempos = [];
var lista_hits = [];
lista_hits[0] = 'Llegada Grupo';
lista_hits[1] = 'Env&iacute;o 1<sup>er</sup> Carro';
lista_hits[2] = 'Env&iacute;o &Uacute;ltimo Carro';
lista_hits[3] = 'Llegada 1<sup>er</sup> Carro';
lista_hits[4] = 'Llegada 2<sup>o</sup> Carro';
	


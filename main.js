// JavaScript Document

function msg(texto){
	if(typeof(navigator.notification)=='undefined'){
		alert(texto);
	}else{
		navigator.notification.alert(
				texto,  				// message
				alertDismissed, // callback
				'Hito',  // title
				'Listo!'        // buttonName
		);
	}
}




function bindButtons(){
  document.getElementById('insertSubmit').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var payload = {name:null};
	  payload.name = document.getElementById('name').value;
	  req.open('POST', '/tableInsert', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
	  if(req.status >= 200 && req.status < 400){
		var response = JSON.parse(req.responseText);
		 document.getElementById('name').value="";
		
	  } else {
		console.log("Error in network request: " + req.statusText);
	  }});
	  req.send(JSON.stringify(payload));
	  event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', bindButtons);


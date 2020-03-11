
function clearMessages(){
	 var messages = document.getElementsByClassName('message');
	 for (i = 0; i < messages.length; i++) {
		 messages[i].textContent="";
	 }
}

function displayTable(){
	
}
function bindButtons(){
  document.getElementById('insertSubmit').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var payload = {name:null};
	  clearMessages();
	  if(document.getElementById('name').value==""){
		 document.getElementById('addMessage').textContent="Name cannot be empty";
		 document.getElementById('addMessage').style.color='red';
		 return;
	  }
	  payload.name = document.getElementById('name').value;
	  payload.reps = document.getElementById('reps').value;
	  payload.weight = document.getElementById('weight').value;
	  payload.unit = document.getElementsByName('unit').value;
	  payload.date = document.getElementById('date').value;
	  req.open('POST', '/tableInsert', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
	  if(req.status >= 200 && req.status < 400){
		var response = JSON.parse(req.responseText);
		 document.getElementById('name').value="";
		 document.getElementById('reps').reps="";
		 document.getElementById('addMessage').textContent="Successful Insert";
		 document.getElementById('addMessage').style.color='green';
		
	  } else {
		console.log("Error in network request: " + req.statusText);
		document.getElementById('addMessage').textContent="Could Not Insert";
		document.getElementById('addMessage').style.color='red';
	  }});
	  req.send(JSON.stringify(payload));
	  event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', bindButtons);


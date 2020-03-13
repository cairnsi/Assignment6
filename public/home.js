
function clearMessages(){
	 var messages = document.getElementsByClassName('message');
	 for (i = 0; i < messages.length; i++) {
		 messages[i].textContent="";
	 }
}

function displayTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/table', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  document.getElementById('workoutList').innerHTML="";
		  var table = document.getElementById('workoutList');
		  if(req.status >= 200 && req.status < 400){
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>Table is empty</th>"
				document.getElementById('tableReset').style.visibility = "hidden";
				return;
			  }
			  document.getElementById('tableReset').style.visibility = "visible";
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Name</th><th>Reps</th><th>Weight</th><th>Unit</th><th>Date</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = cell = row.insertCell();
				  cell.textContent = item.name;
				  cell = row.insertCell();
				  cell.textContent = item.reps;
				  cell = row.insertCell();
				  cell.textContent = item.weight;
				  cell = row.insertCell();
				  cell.textContent = item.lbs;
				  cell = row.insertCell();
				  cell.textContent = item.date;
				  cell = row.insertCell();
				  cell.textContent = item.id;
				  cell = row.insertCell();
				  var btn = cell.createElement("Button");
				  btn.textContent = "Edit";
				  cell.style.visibility = "hidden";
				  cell.id = "rowId";
			  }
		  }else{
			  var row = table.insertRow();
			  row.innerHTML = "<th>Did not get data for Table</th>"
			  
		  }
	  });
	  req.send();
	  
}
function bindButtons(){
  document.getElementById('insertSubmit').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var payload = {name:null};
	  if(document.getElementById('name').value==""){
		  clearMessages();
		 document.getElementById('addMessage').textContent="Name cannot be empty";
		 document.getElementById('addMessage').style.color='red';
		 event.preventDefault();
		 return;
	  }
	  payload.name = document.getElementById('name').value;
	  payload.reps = document.getElementById('reps').value;
	  payload.weight = document.getElementById('weight').value;
	  var units = document.getElementsByName('unit');
	  for(var p = 0; p<units.length;p++){
		  if(units[p].checked){
			  payload.units = units[p].value;
			  break;
		  }
	  }
	  payload.date = document.getElementById('date').value;
	  req.open('POST', '/tableInsert', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
	  clearMessages();
	  if(req.status >= 200 && req.status < 400){
		var response = JSON.parse(req.responseText);
		 document.getElementById('name').value="";
		 document.getElementById('reps').reps="";
		 document.getElementById('addMessage').textContent="Successful Insert";
		 document.getElementById('addMessage').style.color='green';
		 displayTable();
		
	  } else {
		console.log("Error in network request: " + req.statusText);
		document.getElementById('addMessage').textContent="Could Not Insert";
		document.getElementById('addMessage').style.color='red';
	  }});
	  req.send(JSON.stringify(payload));
	  event.preventDefault();
  });
  
  document.getElementById('tableReset').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  req.open('POST', '/tableReset', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		    clearMessages();
			if(req.status < 200 && req.status >= 400){
				document.getElementById('addMessage').textContent="Could Not Clear Table";
				document.getElementById('addMessage').style.color='red';
			}
			displayTable()
			
		});
		req.send();
		event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', bindButtons);
displayTable()

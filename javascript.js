let url = 'http://danieldangs.com/itwd6408/json/faqs.json';

//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------

//setting the warrenty cost//



	$('#warranty').change(function(){
		if(this.checked){
			$('#serviceFee').val(0);
		} else {
			$('#serviceFee').val(85);
		}
	});

//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   	];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
								courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
								courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
			 				 };	
		 
//Handle "click add button" event
$('#addBtn').click(function(e){
	e.preventDefault();
	
	//get selected item info
	let selectedItemText = $('#itemList').find(":selected").text();
	let selectedItemValue = $('#itemList').find(":selected").val();
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//build html code for item//
	let newRow = `
				<tr class="newSelectedItem">
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>
	`;
	
	
	//Append this new row to table if its not existing 
	if(appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) { 
		$('#borrowItems').append(newRow);
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		//update the "bond" element
		if($('#customer').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond); 
		}else {
			$('#bond').val(0);
		}
	} else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
		$('#borrowItems').append(newRow);
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		//update the "bond" element
		if($('#customer').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond); 
		}else {
			$('#bond').val(0);
		}
	} else {
		alert("The item was already added");
	}	
});

//Handle "click remove button" event
$('#removeBtn').click(function(e) {
	//prevent all defult actions attached to this button.
	e.preventDefault();
	//Remove all added rows
	$('.newSelectedItem').remove();
	//update the appstate
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	
	


});	
	
//change "customer type"
$('#customer').click(function() {
	appState.customerType = 'customer';
	$('bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});

$('#buisness').click(function() {
	appState.customerType = 'buisness';
	$('bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
	$('#bond').val(0);
});




$(document).ready(function() {
	$("#customer, #buisness, #warranty").change(function (){
		
		var bond = $("#bond").val();
     	var serviceFee = $("#serviceFee").val();

        var totalFee = +bond + +serviceFee;
        var GST = (totalFee / 20) * 3;
    	var totalGST = +totalFee + +GST;

		$("#totalGST").val(totalGST);
		$("#GST").val(GST);
		$("#totalFee").val(totalFee);
		

	});

	$("#addBtn, #removeBtn").click(function () {
        var bond = $("#bond").val();
        var serviceFee = $("#serviceFee").val();

        var totalFee = +bond + +serviceFee;
        var GST = (totalFee / 20) * 3;
    	var totalGST = +totalFee + +GST;

        $("#totalGST").val(totalGST);
		$("#GST").val(GST);
		$("#totalFee").val(totalFee);
    });
});





let proxy = 'https://cors-anywhere.herokuapp.com/'

$.getJSON(
	proxy + url, //send a request to get this json file
	function(data){
		//loop through all question and extract then and display them on webpage
		$.each(data, function(i, question){
			let content = `
				<div class="col-12 col-md-6 style="background-color: black;">
					<div class="col"
						<div class="p-q" style="background-color: orange;">
						<h4>${question.question}</h4>
						<p>${question.answer}</p?
						</div>
					</div>
				</div>
			`;
			$('#questions').append(content);
		});

	} //json file will be returned in "data"

);

$('#search-box').click(function(e) {
	//prevent all defult actions attached to this button.
	e.preventDefault();
});
	
$('#questions').click(function(e) {
	//prevent all defult actions attached to this button.
	e.preventDefault();	
});

$('#search-box').on('keyup', function() {
	let keywords = $(this).val().toLowerCase();

	$('#questions div').filter(function() {
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
	});
});

$('.content-demo-area div').hide();


$('.btn-demo-area button').on('click', function() {
	$('.btn-demo-area button').css('background-color', 'white');

	$(this).css('background-color', 'orange');

	$('.content-demo-area div').hide();

	$('.content-demo-area div').eq($(this).index()).show(1000);
});

//-------------------------------------		


  
//-------------------------------------		
$(".box" ).draggable({
	scope: 'demoBox',
	revertDuration: 100,
	start: function( event, ui ) {
	  //Reset
	  $( ".box" ).draggable( "option", "revert", true );
	  $('.result').html('-');
	}
  });
  
$(".drag-area" ).droppable({
	scope: 'demoBox',
	drop: function( event, ui ) {
	  let area = $(this).find(".drop-area").html();
	  let box = $(ui.draggable).html();     
	  $( ".box" ).draggable( "option", "revert", false );
	  
	  //Display action in text
	  $('.result').html("[Action] <b>" + box + "</b>" +
						" dropped on " + 
						"<b>" + area + "</b>");
	  
	  //Re-align item
	  $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
	}
 })


 const image_input = document.querySelector("#image-input");

 image_input.addEventListener("change", function() {
   const reader = new FileReader();
   reader.addEventListener("load", () => {
	 const uploaded_image = reader.result;
	 document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
   });
   reader.readAsDataURL(this.files[0]);
 });
 
 $('svg path').each(function(index, item) {
    var id = $(item).attr('id');
        
    $('svg #' + id).on('click', function(e) {
        var id = $(e.currentTarget).attr('id');
        $('svg path').removeClass('active');
        $(e.currentTarget).addClass('active');
        window.alert(id + ' Clicked');
    });
});


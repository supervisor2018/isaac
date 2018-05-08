$(document).ready(function() {
  var stripe = Stripe('pk_test_VdwPB8dfZSR9vXuiZYqfAQQU');
  var elements = stripe.elements();

  $(".donate-form").validate({
    success : function(label){
      label.addClass("valid one-third column").text("✓");
    },
    error : function(e){
      label.addClass("invalid one-third column").text(e) 
    },
    onsubmit:false,
    rules: {
      phone: {
        required: true,
        phoneUS: true
      },
      first_name: {
        required: true,
      },
      email: {
        required: true
      }
    }
  });

  var style = {
    base: {
      // Add your base input styles here. For example:
      background: 'transparent',
      border: '6px solid #364976',
      borderRadius: '4px',
      fontSize: '16px',
      color: "#364976",
      fontFamily: 'Montserrat-Bold',
      '::placeholder': {
        fontFamily: 'Montserrat-Bold',
        fontSize: '16px',
        lineHeight: "50px",
        color: 'rgba(54,73,118,0.90)',
        letterSpacing: '0.33px',
      },
    },
  };
  
  // Create an instance of the card Element.
  var cardNumber = elements.create('cardNumber', {
    style: style,
    placeholder: "Card number",
    classes: {
      focus: 'focused eight columns',
      empty: 'empty eight columns',
      invalid: 'invalid eight columns',
      complete: 'complete eight columns'
    }
  });
  cardNumber.mount('#card-number');

  var cardExpiry = elements.create('cardExpiry', {
    style: style,
    classes: {
      focus: 'focused two columns',
      empty: 'empty two columns',
      invalid: 'invalid two columns',
      complete: 'complete two columns'
    }
  });

  cardExpiry.mount('#expiration-date');

  var cardCvc = elements.create('cardCvc', {
    style: style,
    classes: {
      focus: 'focused two columns',
      empty: 'empty two columns',
      invalid: 'invalid two columns',
      complete: 'complete two columns'
    }
  });

  cardCvc.mount('#cvc');

  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name = document.getElementById("first_name").value + document.getElementById("last_name").value;
    var address = document.getElementById("address_line1").value;
    var address_2 = document.getElementById("address_line2").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var zip = document.getElementById("zip").value;

    var tokenData = {
      name: name,
      address_line1: address, 
      address_line2: address_2,
      address_city: city,
      address_state: state,
      address_zip: zip, 
      address_country: "US"
    };
    console.log(elements);

    stripe.createToken(cardNumber, tokenData).then(function(result) {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
  });

  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripe_token');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
  }

  $("#next").on("click", function(e){
    console.log(e.target);
    nextSection();
  });

  $('label').on("click", function(e){
    setTimeout(function() {
      nextSection();
    }, 80)
  });

  function nextSection(){
    var i = $("fieldset.current").index();
    if (i < 2){
      $("li").eq(i+1).addClass("active");
      goToSection(i+1);
    }
  }

  function goToSection(i){
    $("fieldset:gt("+i+")").removeClass("current").addClass("next");
    $("fieldset:lt("+i+")").removeClass("current");
    $("li").eq(i).addClass("current").siblings().removeClass("current");
    setTimeout(function(){
      $("fieldset").eq(i).removeClass("next").addClass("current active");
        if ($("fieldset.current").index() == 2){
          $("#next").hide();
          $("input[type=submit]").show();
        } else {
          $("#next").show();
          $("input[type=submit]").hide();
        }
    }, 80);
   
  }
});
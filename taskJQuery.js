$(document).ready(function() {
    $("#deliveryOptionsForm").hide();   // hiding the delivery options on load in the cart

    $("#deliveryChosen").click(function() {     // adding click event to the deliverychosen option radio
        
        // When the above radio button is clicked the function to show the delivery options is shown
        $("#deliveryOptionsForm").show("slow").slideDown("slow");   
    });

    // when the mouse enters the left image on the landing page - the image animates to the right and the opacity changes to 0.5
    $("#chaiSpiceImage").mouseenter(function() {
        $(this).animate({
            opacity: "0.5",
            right: "200px"},
            "slow");
    });

    // when the mouse leaves the above image on the landing page - the image animates to the left and the opacity changes to 1
    $("#chaiSpiceImage").mouseleave(function() {
        $(this).animate({
            opacity: "1",
            left: "250px"},
            "slow");
    });


    // chained effects on the trading hours on the contact page
    $("#contactTradingHours").hover(function() {
        $(this).css("background-color", "grey").css("font-size", "1.5em");
    });
    
    // Dropdoown accordian style menu of the testimonials on the about page
    // When the customer name is hovered over, the sibling() element (containing the comment) will slide down
    $(".testimonialCustomer").hover(function() {
        $(this).siblings().show("slow").slideDown("slow");
    });

    // When the mouse leaves the customer name, the sibling() element (containing the comment) will slide up
    $(".testimonialCustomer").mouseout(function() {
        $(this).siblings().hide("slow").slideUp("3000");
    });
});


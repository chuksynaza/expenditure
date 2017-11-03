$(document).ready(function(){
    $(".button-collapse").sideNav();

    $('select').material_select();

    $('.delexp').leanModal();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        closeOnSelect: true,
        closeOnClear: true,
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        max: true,
        onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }

    },
    container: 'body'
});

    $('.datepickera').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        closeOnSelect: true,
        closeOnClear: true,
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        max: true,
        onSet: function( arg ){
                if ( 'select' in arg ){ //prevent closing on selecting month/year
                    this.close();
                }
                
            },
            container: 'body'
     });

    $('.datepickerb').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        closeOnSelect: true,
        closeOnClear: true,
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        max: true,
        onSet: function( arg ){
                if ( 'select' in arg ){ //prevent closing on selecting month/year
                    this.close();
                }
                
            },
           container: 'body'
     });



    $( ".add-expense-form .form-fi" ).change(function() {
        if(($('#msel').val() != '0' && $('#msel').val() != null && $('#msel').val() != '') && $('.exname').val() !='' && $('.examount').val() > 0 && $('.exdate').val() != '')
        {
            $('.add-expense-form').find('.form-su').removeClass('disabled sub');
            $('.add-expense-form').find('.form-su').addClass('sub');
        }
        else
        {
            $('.add-expense-form').find('.form-su').addClass('disabled sub');
            $('.add-expense-form').find('.form-su').removeClass('sub');
        }
    });

    $( ".add-credit-form .form-fi" ).change(function() {
        if($('.crname').val() != '' && $('.cramount').val() > 0 && $('.crdate').val() != '')
        {
         $('.add-credit-form').find('.form-su').removeClass('disabled sub');
         $('.add-credit-form').find('.form-su').addClass('sub');
     }
     else
     {
        $('.add-credit-form').find('.form-su').addClass('disabled sub');
        $('.add-credit-form').find('.form-su').removeClass('sub');
    }
});


    $( ".ourexpss" ).on('click', '.delexp', function() {
        //alert($(this).attr('delexp'));
        $('#modal_delete_expense .modal-content').html($(this).attr('delcnt'));
        $('#modal_delete_expense').openModal();
    });


});



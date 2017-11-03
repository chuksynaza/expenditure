$(document).ready(function(){

   document.addEventListener("deviceready", containReady, false);

   function containReady() {

       function newExp(ecat, etype, ename, emount, edate, edatea)
       {
        db.transaction(function (tx) {
            ttalk = "Expense Added";
            if(ecat == 'credit')
            {
                ttalk = "Credit Added";
            }

         var query = "INSERT INTO myexpense (ecat, etype, ename, emount, edate, edatea) VALUES (?,?,?,?,?,?)";

         tx.executeSql(query, [ecat, etype, ename, emount, edate, edatea], function(tx, res) {
             console.log("insertId: " + res.insertId + " -- probably 1");
             console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
         },
         function(tx, error) {
             console.log('INSERT error: ' + error.message);
         });
     }, function(error) {
         console.log('transaction error: ' + error.message);
     }, function() {
         console.log('transaction ok');
         Materialize.toast(ttalk, 2000,'',function(){location.href = 'index.html';});
     });
    }

    function seeExp(dd, srange, erange, showExpenses)
    {
        var expss;
        var  ddd = "edate";

        
        if(dd == 2)
        {
            ddd = "edatea";
            //ddd = "date(" + ddd + ")";
            srange = srange + " 00:00:00";
            erange = erange + " 23:59:59";
        }
        else
        {
            //ddd = "datetime(" + ddd + ")";
            srange = srange + " 00:00:00";
            erange = erange + " 23:59:59";
        }
        //nsrange = "datetime(" + srange + ")";
        //nerange = "datetime(" + erange + ")";

        db.transaction(function (tx) {
            console.log(srange);
            console.log(erange);

            var query = "SELECT eid, ecat, etype, ename, emount, edate, edatea FROM myexpense WHERE " + ddd + " >= ? AND " + ddd + " <= ?";
            console.log(query);

            tx.executeSql(query, [srange,erange], function (tx, resultSet) {

             expst = 0;
             expss = "";

             for(var x = 0; x < resultSet.rows.length; x++) {
                    //console.log("First name: " + resultSet.rows.item(x).firstname +
                        //", Acct: " + resultSet.rows.item(x).acctNo);

                        
                        ecatp = "+";
                        var pedate = new Date(resultSet.rows.item(x).edate);
                        var pedatea = new Date(resultSet.rows.item(x).edatea);

                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ];
                        var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                        function showctime(cdate)
                        {
                            var mid = 'AM';
                            var chour = cdate.getHours();
                            cshour = chour
                            if(chour > 12)
                            {
                                mid = 'PM';
                                cshour = cshour - 12;
                            }
                            var ourntime = cshour + ":" + cdate.getMinutes() + " " + mid;
                            return ourntime
                        }

                        var cnedate = dayNames[pedate.getDay()] + ", " + pedate.getDate() + " of "  + monthNames[pedate.getMonth()] + ", " + pedate.getFullYear();
                        var cnedatea = dayNames[pedatea.getDay()] + ", " + pedatea.getDate() + " of "  + monthNames[pedatea.getMonth()] + ", " + pedatea.getFullYear() + " " + showctime(pedatea);

                        if(resultSet.rows.item(x).ecat == "credit")
                        {
                            ecatp = "-";
                            expst = parseFloat(expst) - parseFloat(resultSet.rows.item(x).emount);
                        }
                        else
                        {
                            expst = parseFloat(expst) + parseFloat(resultSet.rows.item(x).emount);
                        }


                        var delcnt = "<span class=\"title expdel \" expid = \"" + resultSet.rows.item(x).eid + "\"><b>" + resultSet.rows.item(x).etype + "</b></span> <p> " + resultSet.rows.item(x).ename + "<br> <b>" + ecatp + "NGN " + parseFloat(resultSet.rows.item(x).emount).toFixed(2) + "</b> on " + cnedate + " <br/> <i> Date Added:   " + cnedatea + " </i> </p>";

                        exps = "<li class='collection-item lime lighten-4'> <div> <span class='title'><b>" + resultSet.rows.item(x).etype + "</b></span> <a href='#modal_delete_expense' class='secondary-content red-text modal-trigger waves-effect waves-light delexp' delcnt = '" + delcnt + "'><i class='material-icons'>delete</i></a> <p>" + resultSet.rows.item(x).ename + "<br> <b>" + ecatp + "NGN " + parseFloat(resultSet.rows.item(x).emount).toFixed(2) + " </b> on " + cnedate + " <br/> <i> Date Added: " + cnedatea + " </i> </p> </div> </li>";
                        expss = exps + expss;
                    }
                    expss = expss + "<li class='collection-item lime lighten-4'> <div> <span class='title'><b>Total: NGN " + parseFloat(expst).toFixed(2) + "</b></span> </div> </li>";
                    
                },
                function (tx, error) {
                    console.log('SELECT error: ' + error.message);
                });
        }, function (error) {
            console.log('transaction error: ' + error.message);
        }, function () {
            console.log('transaction ok, db select');
            //console.log(expss);
            showExpenses(expss);

        });

}

function remExp(eid)
{
    db.transaction(function (tx) {

     var query = "DELETE FROM myexpense WHERE eid = ?";

     tx.executeSql(query, [eid], function (tx, res) {
         console.log("removeId: " + res.insertId);
         console.log("rowsAffected: " + res.rowsAffected);
     },
     function (tx, error) {
         console.log('DELETE error: ' + error.message);
     });
 }, function (error) {
     console.log('transaction error: ' + error.message);
 }, function () {
     console.log('transaction ok deleted');
     Materialize.toast('Deleted', 2000,'',function(){location.reload();});
 });
}

function initPages()
{
    var dataMatch = 0;
    var scripts = document.getElementsByTagName('script');

    for(var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
            // you might consider using a regex here
            if (script.getAttribute('src') == 'js/contain.js') {
                // we've got a match
                var dataId = script.getAttribute('data-id');
                var dataMatch = 1;
            }
        }

        $('#modal_delete_expense').on('click', '.deleteexp', function(e)
        {
            var eid = $(".expdel").attr('expid');
            console.log(eid);
            remExp(eid);
            e.preventDefault();
            

        });


        //Pages
        if(dataMatch == 1 && dataId == 'week')
        {
            var cccc = 1;

            document.addEventListener("backbutton", function(e){
                if(cccc > 0){
                    cccc = cccc - 1;
                    console.log('One more to close');
                } else {
                  e.preventDefault();
                  navigator.app.exitApp();
              }
          }, false);


            var datecc = new Date();
            var dateC = datecc.getFullYear() + '-' + ('0' + (datecc.getMonth()+1)).slice(-2) + '-' + ('0' + datecc.getDate()).slice(-2);
            var dateoo = new Date();
            dateoo.setDate(dateoo.getDate() - 7);
            var dateO = dateoo.getFullYear() + '-' + ('0' + (dateoo.getMonth()+1)).slice(-2) + '-' + ('0' + dateoo.getDate()).slice(-2);

            function showExpenses(expenseslist)
            {
                expenseslist = "<li class='collection-header lime lighten-4' style = 'text-align:center'> <b>THIS WEEK</b> </li>" + expenseslist;
                $('.ourexpss').html(expenseslist);
                //console.log(expenseslist);
            }

            seeExp(1, dateO, dateC, showExpenses);

            
            //alert(dateO);
            //alert(dateC);


        }
        else if(dataMatch == 1 && dataId == 'month')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);


            var datecc = new Date();
            var dateC = datecc.getFullYear() + '-' + ('0' + (datecc.getMonth()+1)).slice(-2) + '-' + ('0' + datecc.getDate()).slice(-2);
            var dateoo = new Date();
            dateoo.setMonth(dateoo.getMonth());
            var dateO = dateoo.getFullYear() + '-' + ('0' + (dateoo.getMonth()+1)).slice(-2) + '-' + '01';

            function showExpenses(expenseslist)
            {
                expenseslist = "<li class='collection-header lime lighten-4' style = 'text-align:center'> <b>THIS MONTH</b> </li>" + expenseslist;
                $('.ourexpss').html(expenseslist);
                //console.log(expenseslist);
            }

            seeExp(1, dateO, dateC, showExpenses);


        }
        else if(dataMatch == 1 && dataId == 'months')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);

            var datecc = new Date();
            var dateC = datecc.getFullYear() + '-' + ('0' + (datecc.getMonth()+1)).slice(-2) + '-' + ('0' + datecc.getDate()).slice(-2);
            var dateoo = new Date();
            dateoo.setMonth(dateoo.getMonth() - 3);
            var dateO = dateoo.getFullYear() + '-' + ('0' + (dateoo.getMonth()+1)).slice(-2) + '-' + ('0' + dateoo.getDate()).slice(-2);

            function showExpenses(expenseslist)
            {
                expenseslist = "<li class='collection-header lime lighten-4' style = 'text-align:center'> <b>THREE MONTHS</b> </li>" + expenseslist;
                $('.ourexpss').html(expenseslist);
                //console.log(expenseslist);
            }

            seeExp(1, dateO, dateC, showExpenses);


        }
        else if(dataMatch == 1 && dataId == 'dater')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);

            $('.erange').on('click', '.sub', function(e)
            {
                if($("input[name='sdate']").val() != '' && $("input[name='edate']").val() != '')
                {
                    function showExpenses(expenseslist)
                    {
                        expenseslist = "<li class='collection-header lime lighten-4' style = 'text-align:center'> <b>DATE RANGE</b> </li>" + expenseslist;
                        $('.ourexpss').html(expenseslist);
                        //console.log(expenseslist);
                    }

                    seeExp(1, $("input[name='sdate']").val(), $("input[name='edate']").val(), showExpenses);
                }
            });
        }
        else if(dataMatch == 1 && dataId == 'date')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);

            $('.erange').on('click', '.sub', function(e)
            {
                if($("input[name='sdate']").val() != '' && $("input[name='edate']").val() != '')
                {
                    function showExpenses(expenseslist)
                    {
                        expenseslist = "<li class='collection-header lime lighten-4' style = 'text-align:center'> <b>DATE ADDED</b> </li>" + expenseslist;
                        $('.ourexpss').html(expenseslist);
                        //console.log(expenseslist);
                    }

                    seeExp(2, $("input[name='sdate']").val(), $("input[name='edate']").val(), showExpenses);
                }
            });
        }
        else if(dataMatch == 1 && dataId == 'expense')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);

            $('.add-expense-form').on('click', '.sub', function(e)
            {
                var dateat = new Date();
                var edatea = dateat.getFullYear() + '-' + ('0' + (dateat.getMonth()+1)).slice(-2) + '-' + ('0' + dateat.getDate()).slice(-2) + ' ' + ('0' + dateat.getHours()).slice(-2) + ':' + ('0' + dateat.getMinutes()).slice(-2) + ':' + ('0' + dateat.getSeconds()).slice(-2);
                var edate = $("input[name='exdate']").val() + " 12:00:00";
                newExp('expense', $('#msel').val(), $('.exname').val(), $('.examount').val(), edate, edatea);
                e.preventDefault();
                

            });
        }
        else if(dataMatch == 1 && dataId == 'credit')
        {

            document.addEventListener("backbutton", function(e){
             location.href = 'index.html';
         }, false);

            $('.add-credit-form').on('click', '.sub', function(e)
            {
                var dateat = new Date();
                var crdatea = dateat.getFullYear() + '-' + ('0' + (dateat.getMonth()+1)).slice(-2) + '-' + ('0' + dateat.getDate()).slice(-2) + ' ' + ('0' + dateat.getHours()).slice(-2) + ':' + ('0' + dateat.getMinutes()).slice(-2) + ':' + ('0' + dateat.getSeconds()).slice(-2);
                var crdate = $("input[name='crdate']").val() + " 12:00:00";
                newExp('credit', 'Credit', $('.crname').val(), $('.cramount').val(), crdate, crdatea);
                e.preventDefault();
                

            });
        }

    }


    var db = window.sqlitePlugin.openDatabase({ name: 'expenses.db', location: 'default' }, function (db) {

       db.transaction(function (tx) {
         // ...
         tx.executeSql('CREATE TABLE IF NOT EXISTS myexpense (eid INTEGER PRIMARY KEY, ecat, etype, ename, emount, edate, edatea)');
     }, function (error) {
       console.log('transaction error: ' + error.message + error.code);
       if(error.code == 0)
       {
            //initPages();
        }
    }, function () {
       console.log('transaction ok, table created');
       initPages();
   });

   }, function (error) {
       console.log('Open database ERROR: ' + JSON.stringify(error));
   });


}

});

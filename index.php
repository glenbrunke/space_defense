<?PHP

?>

<!DOCTYPE HTML>
<HTML lang="en">
    <HEAD>
        <meta charset="UTF-8">
        <meta http-equiv="X-US-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv='cache-control' content='no-cache'>
        <meta http-equiv='expires' content='0'>
        <meta http-equiv='pragma' content='no-cache'>


        <STYLE>
                #fireButton {
                    text-decoration: none; 
                    color:black; 
                    padding: 15px 15px;
                    background: #FF4444;
                    font-family: "Montserrat", Sans-serif;
                    font-size: 18px;
                    font-weight: 300;
                }


                #leftButton {
                    text-decoration: none; 
                    color:black; 
                    padding: 15px 15px;
                    background: #9999FF;
                    font-family: "Montserrat", Sans-serif;
                    font-size: 18px;
                    font-weight: 300;
                }
                
                #rightButton {
                    text-decoration: none; 
                    color:black; 
                    padding: 15px 15px;
                    background: #9999FF;
                    font-family: "Montserrat", Sans-serif;
                    font-size: 18px;
                    font-weight: 300;
                }
                body {
                    background-color: black;
                }
        </STYLE>


        <TITLE>Space Defense - A JavaScript Game</TITLE>
        <SCRIPT src="space_defense.js" defer></SCRIPT>
        
        <style>
            #myCanvas {
                background-color: black;
            }
        </style>
    </HEAD>
    
    <BODY>
        <CANVAS id="myCanvas" width="350" height="450" style="border: 1px solid #000000;"></CANVAS>
        
        <BR><BR>&nbsp;&nbsp;&nbsp;&nbsp;<A HREF="#" ID="leftButton"><</A>&nbsp;&nbsp;&nbsp;&nbsp;<A HREF="#" ID="rightButton">></A>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<A HREF="#" ID="fireButton">FIRE</A><BR>
    </BODY>
    

</HTML>
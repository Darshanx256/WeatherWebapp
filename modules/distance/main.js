function populateDynamicContent() {
    // Construct the HTML content
    var dynamicContent = `
    <style>
        .container {
            position: relative;
            max-width: 800px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.5s ease-in-out;
        }

        .distmap-container {
            width: 100%;
            height: 200px;
            background-color: #f0f0f0;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .distmap-container img{
            width: 100%;
        }

        .err {
            background-color: #ffcccc;
            color: #cc0000;
            text-align: center;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-group label {
            display: block;
            margin-bottom: 5px;
        }

        .input-group input, .input-group button {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .input-group button {
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }

        h2 {
            margin-bottom: 20px;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
        }

        .info-group {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        .info-item {
            flex: 0 0 25%; /* Adjusted to 25% for four columns */
            padding: 10px;
        }

        .info-label {
            color: #666;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .info-value {
            color: #333;
        }

        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }

    </style>
</head>
<body>

<div class="container">
    <a href = "" class="close-button">×</a>
    <h1 style = "color:black;">Distance Information</h1>

    <div id="input">
        <div class="input-group">
            <label for="source" style = "color:black;">Source:</label>
            <input type="text" id="source" name="source" placeholder="Enter source">
        </div>

        <div class="input-group">
            <label for="destination" style = "color:black;">Destination:</label>
            <input type="text" id="destination" name="destination" placeholder="Enter destination">
        </div>

        <div class="input-group">
            <button id="get-info"><i class="fas fa-search"></i> Get Info</button>
        </div>

        <div class="err" id="conerr" style = "display:none;">
            <i class="fas fa-exclamation-triangle"></i> Network error!
        </div>

        <div class="err" id="locerr" style = "display:none;">
            <i class="fas fa-exclamation-triangle"></i> Invalid location!
        </div>
    </div>

    <div class="output"></div>
    <div id="infos" style="display: none;">
        <div class="distmap-container">
        <img id = "minimap2">
        </div>
        
        <table>
            <tr>
                <td>
                    <div class="info-group">
                        <div class="info-item">
                            <div class="info-label">Direct Distance:</div>
                            <div class="info-value" id="direct-distance">100 km</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <div class="info-label">By-Road Distance:</div>
                        <div class="info-value" id="by-road-distance">120 km</div>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <div class="info-label">Time to Travel:</div>
                        <div class="info-value" id="time-to-travel">2 hours</div>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <div class="info-label">Source Latitude:</div>
                        <div class="info-value" id="source-lat">40.7128</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="info-item">
                        <div class="info-label">Source Longitude:</div>
                        <div class="info-value" id="source-lng">-74.0060</div>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <div class="info-label">Destination Latitude:</div>
                        <div class="info-value" id="destination-lat">34.0522</div>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <div class="info-label">Destination Longitude:</div>
                        <div class="info-value" id="destination-lng">-118.2437</div>
                    </div>
                </td>
                <td colspan="2">
                    <div class="input-group">
                        <button id="go-back"><i class="fas fa-search"></i> Search Again</button>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

`;

    // Populate the dynamic content into the specified div
    document.getElementById('distance-popup').innerHTML = dynamicContent;
}
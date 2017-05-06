var body = document.body;
var html = document.documentElement;

var height = Math.max(  body.scrollHeight,
                        body.offsetHeight, 
                        html.clientHeight,
                        html.scrollHeight,
                        html.offsetHeight  );
var finishedPosition = height - window.innerHeight;

var topPosition = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);

var options = {
    'color': {
        'startingHue':  0,
        'endingHue':    120,
        'saturation':   70,
        'lightness':    70    
    },
    'reading': {
        'wordsPerMinute': 400
    }
    
}

var percentageToHsl = function(percentage, fromHue, toHue) {
    var hue = (percentage * (toHue - fromHue)) + fromHue;
    return 'hsla(' + hue + ', ' + options.color.saturation + '%, ' + options.color.lightness + '%, 0.8)';
}

var updateProgress = function(topPos, finishedPos, elementToUpdate) {

    var progressRatio = topPos / finishedPos;
    var progressPercent;

    if (progressRatio > 1) {
        progressPercent = 100;    
    } else {
        progressPercent = progressRatio * 100;
    }
    

    var color = percentageToHsl(progressRatio, options.color.startingHue, options.color.endingHue);
    var readingTime = Math.floor(countWords() / options.reading.wordsPerMinute);

    chrome.runtime.sendMessage({
        color: color, 
        progressRatio: progressRatio, 
        readingTime: readingTime
    });

    elementToUpdate.style.width = progressPercent + '%';
    elementToUpdate.style.background = color;
}

var countWords =  function() {
    var words = body.innerHTML.replace(/( | )/,' ').replace(/[\n\r]/g, ' ').replace(/<.*?>/g, '');
    return words.match(/\S+/g).length;
}

window.onload = function () {
    body.insertAdjacentHTML( 'afterbegin', '<nav class="page-progress"><section class="read"></section></nav>');

    var progressBarElement = document.getElementsByClassName('page-progress')[0];
    var readProgressElement = document.getElementsByClassName('read')[0];

    progressBarElement.style.background = 'hsla(180, 100%, 97%, 0.8)';
    progressBarElement.style.width = '100%';
    progressBarElement.style.height = '0.3rem';
    progressBarElement.style.position = 'fixed';
    progressBarElement.style.left = '0';
    progressBarElement.style.top = '0';
    progressBarElement.style.zIndex = '9999';

    readProgressElement.style.width = '0%';
    readProgressElement.style.height = 'inherit';

    // If the content does not exceed the window hide the progress bar.
    if (topPosition === finishedPosition) {
        progressBarElement.style.height = '0';
    } 
    
    updateProgress(topPosition, finishedPosition, readProgressElement);

    window.onscroll = function() {
        topPosition = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
        updateProgress(topPosition, finishedPosition, readProgressElement);
    }

    window.onresize = function() {
        height = Math.max(  body.scrollHeight,
                            body.offsetHeight, 
                            html.clientHeight,
                            html.scrollHeight,
                            html.offsetHeight  );

        finishedPosition = height - window.innerHeight;
        updateProgress(topPosition, finishedPosition, readProgressElement);
    }

}
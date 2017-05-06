var dataForDrawing = {
  color: 'hsla( 0, 0%, 0%, 0)',
  readingTime: '?',
  progressRatio: 0
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    dataForDrawing.color = request.color;
    dataForDrawing.readingTime = request.readingTime;
    dataForDrawing.progressRatio = request.progressRatio;
    
    draw(dataForDrawing);
  }
);

draw(dataForDrawing);

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
  chrome.tabs.getSelected(null, function(tab) {
    dataForDrawing = {
      color: 'hsla( 0, 0%, 0%, 0)',
      readingTime: '?',
      progressRatio: 0
    }
    draw(dataForDrawing);
  });
});

function draw(dataForDrawing) {
  var canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext('2d');
  context.fillStyle = 'hsla( 0, 0%, 0%, 0.1)';
  context.fillRect(0, 0, 16, 16);
  context.fillStyle = dataForDrawing.color;
  context.fillRect(0, 0, 16 * dataForDrawing.progressRatio, 16);

  context.fillStyle = '#888';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '11px Arial';
  context.fillText(dataForDrawing.readingTime, 8, 8);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 16, 16)
  });
}


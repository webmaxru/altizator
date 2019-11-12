window.addEventListener('load', function() {

  function isOriginSameAsLocation(url) {
    var pageLocation = window.location;
    var URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/;
    var urlMatch = URL_HOST_PATTERN.exec(url) || [];
    var urlparts = {
      protocol: urlMatch[1] || '',
      host: urlMatch[2] || '',
      port: urlMatch[3] || ''
    };

    function defaultPort(protocol) {
      return { 'http:': 80, 'https:': 443 }[protocol];
    }

    function portOf(location) {
      return (
        location.port || defaultPort(location.protocol || pageLocation.protocol)
      );
    }

    return !!(
      urlparts.protocol &&
      urlparts.protocol == pageLocation.protocol &&
      (urlparts.host && urlparts.host == pageLocation.host) &&
      (urlparts.host && portOf(urlparts) == portOf(pageLocation))
    );
  }

  function describe(image) {
    fetch(
      'https://altizator-vision.cognitiveservices.azure.com/vision/v2.0/describe',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '<your Azure Cognitive Services key>'
        },
        body: JSON.stringify({
          url: image.src
        })
      }
    )
      .then(res => {
        return res.json();
      })
      .then(descr => {
        alt = descr['description']['captions'][0]['text'];
        image.alt = alt;
        console.log(`Alt "${alt}" was added for image ${image.src}`);
      })
      .catch(err => {
        //console.error(err);
      });
  }


  var images = document.querySelectorAll('img');

  console.log(`Found ${images.length} images on the page`)

  for (var i = 0; i < images.length; i++) {
    
    var image = images[i];
    if (
      isOriginSameAsLocation(image.src) &&
      image.width > 50 &&
      image.height > 50
    )
      describe(image);
  }
});

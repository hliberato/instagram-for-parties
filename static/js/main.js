var settings = {
  hashtags: "larabeatriz15", // separated by comma
  client_id: "b72d081f9d4e48639b48bdc682eafc99", // your instagram API key
  images_to_fetch: 20, // fetch 20 images every request to instagram
  fetch_time: 50, // fetch pictures every 50 seconds
  display_time: 10 // change picture every 10 seconds
}

// the heart of this app
var queue = new Queue();

  function fillQueue() {
    // make the queue always empty so we can see all pics!
    if (queue.getLength() < 10)
    {
    $.ajax({
      dataType: "jsonp",
      url: "https://api.instagram.com/v1/tags/" + settings.hashtags + "/media/recent",
      data: {
        access_token: null,
        client_id: settings.client_id,
        count: settings.images_to_fetch
      },
      success: function(response) {
        
        var photos = response.data;
        console.log("Number of pictures fetched: " + photos.length);

        for (var i = 0; i < photos.length; i++)
        {
          var photo = photos[i];

          var img = photo.images.standard_resolution.url; // get photo url
          var username = photo.user.username; // get username
          var comment = photo.caption.text; // get message
          var profile_picture = photo.user.profile_picture; //get the profile picture

          // put the picture on queue
          queue.enqueue({img: img, username: username, comment: comment, profile_picture: profile_picture});
          console.log("Added image taken by: " + username);
        }						
      }
    });
  }
  else
  {
    console.log("Queue is full!");
  }

  setTimeout(function() {
        fillQueue();
    }, settings.fetch_time * 1000);
  }

  function showQueue()
  {
    if (! queue.isEmpty())
    {
      var img = queue.dequeue();
      console.log("Displaying: " + img.img);

      // check if the images are different
      if ($('.instagram-pic > img').attr('src') != img.img)
      {
        console.log('New picture, now displaying: ' + img.img);

        // preload image before display
        $('<img class="loader" />').attr('src', img.img).appendTo('body').load(function(){

          $('.instagram-username, .instagram-pic > img, .instagram-comment').fadeOut(600, function(){
            $('.instagram-pic > img').attr('src', img.img);
            $('.instagram-comment > p').html(img.comment);
            $('#instagram-username').html(' @ '+img.username);
            $('#user-photo').attr('src', img.profile_picture);
          }).fadeIn();
        
      });
    }
  }

    setTimeout(function() {
        showQueue();
    }, settings.display_time * 100);
  }

  $(document).ready(function() {
  fillQueue();
  showQueue();
  });
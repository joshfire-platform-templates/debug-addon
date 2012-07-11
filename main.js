var listEl = document.getElementById('list');
var itemEl = document.getElementById('item');
var addonsEl = document.getElementById('addons');
var datasource = Joshfire.factory.getDataSource('main');
var feed = [];

/**
 * Renders the feed's list and triggers the "list" hook
 */
var renderFeed = function () {
  itemEl.innerHTML = '';
  addonsEl.innerHTML = '';
  var res = '<ul>';
  for (var i=0; i<feed.length; i++) {
    res += formatItemInList(feed[i], i);
  }
  res += '</ul>';
  listEl.innerHTML = res;

  addons = Joshfire.factory.getAddOns('list');
  addons.render(addonsEl, {
    data: feed,
    dataEl: listEl.firstChild
  }, function (err) {
    console.log('list hook called, error:', err);
  });
};

/**
 * Renders the feed item identified by its index and triggers the "item" hook
 */
var renderItem = function (idx) {
  listEl.innerHTML = '';
  addonsEl.innerHTML = '';
  itemEl.innerHTML = formatItem(feed[idx]);

  addons = Joshfire.factory.getAddOns('item');
  addons.render(addonsEl, {
    data: feed[idx],
    dataEl: itemEl
  }, function (err) {
    console.log('item hook called, error:', err);
  });
};


/**
 * Formats the item for use in a list of items
 */
var formatItemInList = function (entry, idx) {
  return '<li data-idx="' + idx + '">\n' +
    formatItem(entry) +
    '</li>\n';
};

/**
 * Generates the HTML for the given feed item
 */
var formatItem = function (entry) {
  var str = '';
  var date = null;
  var author = null;

  // The title when defined
  if (entry.name) {
    str += '<h4>' + entry.name + '</h4>\n';
  }

  // Main image when defined
  if (entry.image && entry.image.contentURL) {
    str += '<p class="image"><img src="' + entry.image.contentURL + '" alt="" /></p>\n';
  }
  else if (entry.thumbnailUrl) {
    str += '<p class="image"><img src="' + entry.thumbnailUrl + '" alt="" /></p>\n';
  }
  else if (entry.thumbnail && entry.thumbnail[0] && entry.thumbnail[0].contentURL) {
    str += '<p class="image"><img src="' + entry.thumbnail[0].contentURL + '" alt="" /></p>\n';
  }
  else if ((entry['@type'] === 'ImageObject') && entry.contentURL) {
    str += '<p class="image"><img src="' + entry.contentURL + '" alt="" /></p>\n';
  }

  // Main author when defined
  author = entry.author ? entry.author[0] : entry.byArtist;
  if (author && author.name) {
    str += '<p class="author">By ' + author.name + '</p>\n';
  }

  // Main date when defined
  date = entry.datePublished ||
    entry.dateModified ||
    entry.dateCreated ||
    entry.uploadDate ||
    entry.startDate ||
    entry.endDate ||
    entry.datePosted ||
    entry.foundingDate ||
    entry.birthDate ||
    entry.deathDate;
  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(date)) {
    str += '<p class="date">(' + date.substring(0, 10) + ')</p>\n';
  }

  return str;
};

// Fetch the datasource
datasource.find({}, function (err, data) {
  if (err) {
    listEl.innerHTML = '<pre>' + err + '</pre>';
    return;
  }

  // Save the feed
  feed = data.entries;

  // Render the feed
  renderFeed();

  // Listen to clicks on list items and display an item when
  // one is clicked
  listEl.addEventListener('click', function (evt) {
    var target = evt.target;
    var idx = 0;
    while (target) {
      if (target.nodeName === 'LI') break;
      target = target.parentNode;
    }
    if (target) {
      idx = parseInt(target.getAttribute('data-idx'), 10);
      renderItem(idx);
    }
  });

  // Listen to clicks on an item detail and go back to the list
  // when the item is clicked
  itemEl.addEventListener('click', function (evt) {
    renderFeed();
  });
});

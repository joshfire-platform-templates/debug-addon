var listEl = document.getElementById('list');
var itemEl = document.getElementById('item');
var addonsEl = document.getElementById('addons');
var datasource = Joshfire.factory.getDataSource('main');
var feed = [];

var renderFeed = function () {
  var res = '<ul>';
  for (var i=0; i<feed.length; i++) {
    res += formatItemInList(feed[i]);
  }
  res += '</ul>';
  listEl.innerHTML = res;
};

var formatItemInList = function (entry) {
  var str = '<li>';
  var date = null;
  var author = null;

  // The title when defined
  if (entry.name) {
    str += '<h4>' + entry.name + '</h4>';
  }

  // Main image when defined
  if (entry.image && entry.image.contentURL) {
    str += '<p class="image"><img src="' + entry.image.contentURL + '" alt="" /></p>';
  }
  else if (entry.thumbnailUrl) {
    str += '<p class="image"><img src="' + entry.thumbnailUrl + '" alt="" /></p>';
  }
  else if (entry.thumbnail && entry.thumbnail[0] && entry.thumbnail[0].contentURL) {
    str += '<p class="image"><img src="' + entry.thumbnail[0].contentURL + '" alt="" /></p>';
  }
  else if ((entry['@type'] === 'ImageObject') && entry.contentURL) {
    str += '<p class="image"><img src="' + entry.contentURL + '" alt="" /></p>';
  }

  // Main author when defined
  author = entry.author ? entry.author[0] : entry.byArtist;
  if (author && author.name) {
    str += '<p class="author">By ' + author.name + '</p>';
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
    str += '<p class="date">(' + date.substring(0, 10) + ')</p>';
  }

  /*
  if (entry.description) {
    str += '<p>' + entry.description + '</p>';
  }
  */

  str += '</li>';
  return str;
};

var renderItem = function (item) {

};

function datarefresh() {
  var idx = selectElement.options[selectElement.selectedIndex].value;
  var datasource = datasources.children ?
    datasources.children[idx] :
    datasources;
  datasource.find({}, function (err, data) {
    if (err) datacontent.innerHTML = err;
    else datacontent.innerHTML = JSON.stringify(data, null, 2);
  });
}

// Fetch the datasource
datasource.find({}, function (err, data) {
  if (err) {
    listEl.innerHTML = '<pre>' + err + '</pre>';
    return;
  }
  feed = data.entries;
  renderFeed();
}

if (datasources.children) {
  for (var i = 0; i < datasources.children.length; i++) {
    selectElement.innerHTML += '<option value="' + i + '"' +
      (i === 0 ? ' selected' : '') + '>' +
      datasources.children[i].name +
      '</option>';
  }
}
else {
  selectElement.innerHTML += '<option value="0">' +
    datasources.name +
    '</option>';
}

datarefresh();

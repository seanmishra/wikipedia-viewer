$(document).ready(function() {

	var srsearch, sroffset;

	var getArticles = function(sroffset) {
		var loader = $('<div class="col s12 center-align loader"><div class="progress"><div class="indeterminate"></div></div></div>');
		loader.appendTo('.articles');
		var wikiurl = "https://en.wikipedia.org/w/api.php";
		var dataList = {
			'action': 'query',
			'format': 'json',
			'list': 'search',
			'srprop': 'snippet',
			'srlimit': 9,
			'srsearch': srsearch
		};
		if (sroffset !== 0) dataList.sroffset = sroffset;
		else console.log('null offset triggered');
		return $.ajax({
			url: wikiurl,
			dataType: 'jsonp',
			data: dataList,
			jsonp: 'callback'
		});
	};

	var setArticles = function(data) {
		data.query.search.forEach(function(article) {
			var articleUrl = article.title.replace(/\s/g, "_");
			var card = $('<div class="col s12 m6 l4"><div class="card hoverable teal darken-1"><div class="card-content white-text"><span class="card-title truncate" title="' + article.title + '">' + article.title + '</span><p>' + article.snippet + '...</p></div><div class="card-action"><a target="_blank" href="http://en.wikipedia.org/wiki/' + articleUrl + '">Read Article</a></div></div></div>');
			card.appendTo('.articles');
			$('.loader').remove();
		});
		if (data.hasOwnProperty("continue")) {
			var moreBtn = $('<div class="col s12 center-align moreBtn"><button class="btn">Load More Results</button></div>');
			moreBtn.appendTo('.articles');
			sroffset = data.continue.sroffset;
		}
	};

	$('form.search').on('submit', function(e) {
		e.preventDefault();
		$('#search').blur().prop("disabled", true);
		srsearch = $('#search').val().trim();
		if (srsearch !== "") {
			srsearch = srsearch.replace(/\s/g, "+");
			$('.articles').html('');
			getArticles(0).done(function(data) {
				var hits = data.query.searchinfo.totalhits;
				if (hits === 0) {
					Materialize.toast("No results found!", 4000, 'teal darken-4 white-text');
					$('.loader').remove();
				} else {
					Materialize.toast("Search complete! " + hits + " results found.", 4000, 'teal darken-4 white-text');
					setArticles(data);
				}
			});
		} else {
			Materialize.toast('Nothing to search!', 4000, 'teal darken-4 white-text');
		}
		$('#search').prop("disabled", false);
	});

	$('.articles').on('click', '.moreBtn', function() {
		$(this).remove();
		getArticles(sroffset).done(setArticles);
	});

	$('.modal-trigger').leanModal();

});

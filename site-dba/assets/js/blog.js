document.addEventListener('DOMContentLoaded', function () {
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('.post-card[data-category]');
  if (!chips.length || !cards.length) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var filter = chip.dataset.filter;
      cards.forEach(function (card) {
        var match = filter === 'todos' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
});

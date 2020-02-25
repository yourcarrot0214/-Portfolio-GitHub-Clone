const API_URL = "https://floating-harbor-78336.herokuapp.com/fastfood";

// window.load
$(function() {
  // Search Button Event Handler
  $(".btn-search").click(function() {
    let searchKeyword = $("#txt-search").val();
    search(1, 10, searchKeyword);
  });

  // Search Box Event Handler( keyCode 13 === Enter )
  $("#txt-search").on("keypress", function(e) {
    if (e.keyCode === 13) {
      $(".btn-search").trigger("click");
    }
  });
});

// 검색기능구현함수
function search(page, perPage, searchKeyword) {
  if (typeof page !== "number" || page < 1) page = 1;
  if (typeof perPage !== "number" || perPage < 10) perPage = 10;

  // jQuery Ajax
  // $.get( 요청할 url, 요청에 포함시킬 인자들, 응답이 왔을 때 실행될 함수, 데이터 타입)
  $.get(
    API_URL,
    {
      page: page,
      perPage: perPage,
      searchKeyword: searchKeyword
    },
    function(data) {
      let list = data.list;
      let total = data.total;

      $(".total").html("총 " + total + "개의 패스트푸드점을 찾았습니다.");

      let $list = $(".list").empty();

      for (let i = 0; i < list.length; i++) {
        let item = list[i];

        let $elem = $("#item-template")
          .clone()
          .removeAttr("id");

        $elem.find(".item-no").html(i + 1);
        $elem.find(".item-name").html(item.name);
        $elem.find(".item-addr").html(item.addr);

        $list.append($elem);
      }

      showPaging(page, perPage, total, searchKeyword);
    } // ,"json"
  );
}

// 페이지 하단 페이징 구현
function showPaging(page, perPage, total, searchKeyword) {
  let $paging = $(".paging").empty();

  let numPages = 5;
  let pageStart = Math.floor((page - 1) / numPages) * numPages + 1;
  let pageEnd = pageStart + numPages - 1;
  let totalPages = Math.floor((total - 1) / perPage) + 1;

  if (pageEnd > totalPages) pageEnd = totalPages;

  let prevPage = pageStart - 1;
  if (prevPage < 1) prevPage = 1;

  let nextPage = pageEnd + 1;
  if (nextPage > totalPages) nextPage = totalPages;

  let $prevElem = $(
    '<a href="javascript:search(' +
      prevPage +
      ", " +
      perPage +
      ", '" +
      searchKeyword +
      "')\">이전</a>"
  );
  $prevElem.addClass("prev");
  $paging.append($prevElem);

  for (let i = pageStart; i <= pageEnd; i++) {
    let $elem = $(
      '<a href="javascript:search(' +
        i +
        ", " +
        perPage +
        ", '" +
        searchKeyword +
        "')\">" +
        i +
        "</a>"
    );

    if (i === page) $elem.addClass("current");

    $paging.append($elem);
  }

  let $nextElem = $(
    '<a href="javascript:search(' +
      nextPage +
      ", " +
      perPage +
      ", '" +
      searchKeyword +
      "')\">다음</a>"
  );
  $nextElem.addClass("next");
  $paging.append($nextElem);
}

function getAnalyticsData() {
  var viewId = "ga:" + "1*****3"; //ここにVIEW_IDを入力
  var sheet = SpreadsheetApp.getActive().getSheetByName('data');
  dt = new Date();
  var endDate = Utilities.formatDate(dt, 'Asia/Tokyo', 'yyyy-MM-dd');
  dt.setDate(dt.getDate()-30);
  var startDate = Utilities.formatDate(dt, 'Asia/Tokyo', 'yyyy-MM-dd');

  var response = AnalyticsReporting.Reports.batchGet({
    reportRequests: [{
      viewId: viewId,
      dateRanges: [{
        startDate: startDate,
        endDate: endDate
      }],
      metrics: [{
        expression: 'ga:pageviews',
        
      }],
      dimensions: [{'name': 'ga:pagePath'}, {'name': 'ga:pageTitle'}],
      orderBys: [{
        fieldName: 'ga:pageviews',  // PV降順はこちら
        //fieldName: 'ga:pagePath', // URL降順はこちら
        sortOrder: 'DESCENDING'
      }],
      samplingLevel: 'LARGE',
      pageSize: '100000'
    }]
  });


  var json = JSON.parse(response);
  var data = json.reports[0].data;
  
  // データ作成
  var dataset = [];
  //var begin = 2;
  var r = 2;
  data.rows.forEach(function(row) {
    var url = row.dimensions[0].replace(/\?.*$/g, '');
    var title = row.dimensions[1].replace(/\?.*$/g, '');
    var value = row.metrics[0].values[0];

    if(r>2) {
      var prevRow = dataset[dataset.length-1];
      var regUrl = url.replace(/\?.*$/g, '');
      var prevUrl = prevRow[0];
      if(prevUrl === regUrl) {
        r--;
        prevRow[1] = Number(prevRow[1]) + Number(value);
      } else {
        dataset.push([url, title, value]);
      }
    } else {
      dataset.push([url, title, value]);
    }
    r++;
  });

  sheet.getRange(2, 1, dataset.length, 3).setValues(dataset);
}

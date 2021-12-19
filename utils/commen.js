function openArticle(article) {
    wx.navigateTo({
        url: '/pages/article/article?src=' + encodeURIComponent(article)
    })
}
module.exports={
    openArticle
}
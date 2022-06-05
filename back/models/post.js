

module.exports = (sequelize, DataTypes) => {
    //model은 대문자 단수명을 사용
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,//text는 글자 무제한
            allowNull: false,//null값 허용 X
        },
        //자신이 어느 한 모델에 속한다면 그 속하는 모델의 id는 자동으로 추가된다

        //RetweetId
        //원래 post가 post 본인에게 속하기 때문에 PostId가 추가되어야하지만 as로 이름을 바뀌었다
    }, {
        //이모티콘도 사용하기위해서 mb4를 추가
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); //post의 작성자
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

        //리트윗, 특정 포스트가 하나의 포스트에게 속한 경우, 원본 게시글 하나에 여러 리트윗이 가능하므로 1대다 관계
        //속하는 상대방 모델[포스트]를 Retweet이라 명명한다. 포스트 내부 column에 PostId 대신 RetweetId로 추가된다.
        db.Post.belongsTo(db.Post, { as: 'Retweet' });

        //좋아요는 유저와 포스트가 다대다 관계를 가지는 것
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    };
    return Post;
}
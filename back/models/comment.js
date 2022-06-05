
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        //belongsTo 관계를 설정하면 적어주지 않아도 관계로 인한 column이 추가된다. hasMany 관계에선 생기지 않는다
        //Userid : 2,
        //Postid : 4
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}
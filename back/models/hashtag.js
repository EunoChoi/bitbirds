
//모델을 시퀄라이즈 문법(자바스크립트)으로 생성
//시퀄라이즈 라이브러리가 생성한 시퀄라이즈 객체와, 시퀄라이즈 라이브러리 자체가 매개변수로 사용
module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        content: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Hashtag.associate = (db) => {
        //hashtag와 post는 다대다 관계
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}
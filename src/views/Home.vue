<template>
  <div>
    <section v-if="errored">
      <p>{{errored}}</p>
    </section>
    <section v-else>
      <div v-if="loading" style="margin-top:240px">
        <center>
          <img src="@/assets/dna.gif" />
        </center>
      </div>
      <div v-else>
        <div class="heade">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="title">
            <span style="font-weight: 500;">Blood Line</span>
            <br />
          </div>
          <center>
            <vue-typer :text="['Decode Your DNA !', 'Find your Roots !', 'Have Fun !']"></vue-typer>
          </center>
          <center>
            <touch-ripple @click.native="showModal = true" class="button-box" :speed="1.1">
              <button class="btn btn-success my-btn" @click="showModal = true">+ Your Family Tree</button>
            </touch-ripple>
          </center>
        </div>
        <AddFamily v-if="showModal == true" v-on:close="showModal=false "></AddFamily>
        <div v-for="data in info" :key="data.id">
          <center>
            <!-- <touch-ripple class="div-box container jumbotron" :speed="2" :opacity="0.3" color="#999" transition="cubic-bezier(0.18, 0.89, 0.32, 1.28)"> -->
            <div class="container div-box">
              <i
                class="icofont-camera float-left"
                style="color:white; font-size:25px"
                data-toggle="tooltip"
                title="Celebrity Family"
              ></i>
              <router-link :to="{name:'MainTree', params:{id:data.surname}}">
                <div class="title">{{data.title}}</div>
              </router-link>
              <p class="surname">Surname : {{data.surname}}</p>
            </div>
            <!-- </touch-ripple> -->
          </center>
        </div>
      </div>

      <!-- Surname Tree -->
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
.div-box {
  border: 3px solid white;
  border-radius: 10px;
  margin-bottom: 40px;
  padding: 20px;
}
a:hover {
  text-decoration: none !important;
}
.title {
  font-size: 35px;
  font-weight: bold;
  color: white;
}
.surname {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.heade {
  margin-bottom: 60px;
}
#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 108px 405px #fff, 773px 892px #fff, 186px 744px #fff,
    1872px 956px #fff, 1514px 1612px #fff, 840px 748px #fff, 1330px 1172px #fff,
    1712px 1833px #fff, 973px 1258px #fff, 1640px 1934px #fff, 1961px 397px #fff,
    70px 208px #fff, 1878px 845px #fff, 1644px 1800px #fff, 108px 1357px #fff,
    991px 1421px #fff, 1451px 51px #fff, 1988px 1347px #fff, 835px 480px #fff,
    1454px 951px #fff, 724px 1553px #fff, 208px 865px #fff, 454px 1848px #fff,
    896px 1015px #fff, 85px 937px #fff, 1544px 1865px #fff, 1828px 414px #fff,
    1766px 377px #fff, 1993px 1454px #fff, 1189px 1600px #fff, 1030px 740px #fff,
    1280px 1768px #fff, 1053px 702px #fff, 363px 1518px #fff, 1498px 335px #fff,
    617px 1185px #fff, 788px 885px #fff, 596px 1201px #fff, 1015px 1374px #fff,
    478px 1338px #fff, 1726px 630px #fff, 1144px 1304px #fff, 1243px 365px #fff,
    749px 377px #fff, 149px 1431px #fff, 1305px 543px #fff, 821px 945px #fff,
    977px 1252px #fff, 420px 1268px #fff, 776px 1031px #fff, 334px 383px #fff,
    666px 1577px #fff, 1548px 1911px #fff, 408px 1191px #fff, 1711px 366px #fff,
    1179px 1693px #fff, 1631px 1453px #fff, 1951px 1285px #fff, 837px 414px #fff,
    155px 1641px #fff, 1164px 1311px #fff, 1430px 988px #fff, 1951px 448px #fff,
    1870px 557px #fff, 1613px 164px #fff, 1845px 738px #fff, 918px 1613px #fff,
    107px 1602px #fff, 458px 1941px #fff, 669px 504px #fff, 1003px 1251px #fff,
    15px 51px #fff, 771px 470px #fff, 66px 1101px #fff, 830px 859px #fff,
    1842px 286px #fff, 1968px 39px #fff, 730px 1866px #fff, 1157px 1044px #fff,
    651px 19px #fff, 1674px 1696px #fff, 1275px 1779px #fff, 1149px 1619px #fff,
    61px 726px #fff, 1701px 134px #fff, 1916px 937px #fff, 832px 192px #fff,
    1738px 132px #fff, 349px 1645px #fff, 771px 1921px #fff, 1658px 1097px #fff,
    219px 1169px #fff, 1831px 662px #fff, 273px 1147px #fff, 1080px 1543px #fff,
    1905px 1439px #fff, 755px 182px #fff, 1944px 1720px #fff, 407px 1807px #fff,
    1359px 1062px #fff, 1235px 1384px #fff, 226px 877px #fff, 1549px 583px #fff,
    1405px 1326px #fff, 1262px 1198px #fff, 1520px 1427px #fff,
    459px 1770px #fff, 1705px 653px #fff, 555px 895px #fff, 1243px 1984px #fff,
    69px 525px #fff, 22px 510px #fff, 645px 864px #fff, 1620px 246px #fff,
    1024px 1760px #fff, 1824px 844px #fff, 328px 1677px #fff, 1043px 1410px #fff,
    522px 1634px #fff, 796px 1394px #fff, 885px 1364px #fff, 349px 1873px #fff,
    489px 538px #fff, 1762px 1197px #fff, 1999px 1109px #fff, 535px 305px #fff,
    1429px 990px #fff, 1979px 1472px #fff, 853px 1911px #fff, 53px 747px #fff,
    1673px 4px #fff, 1989px 550px #fff, 437px 1859px #fff, 1186px 1037px #fff,
    1313px 1755px #fff, 1803px 49px #fff, 425px 1420px #fff, 243px 112px #fff,
    854px 1606px #fff, 1033px 158px #fff, 354px 659px #fff, 694px 290px #fff,
    195px 1442px #fff, 76px 457px #fff, 630px 53px #fff, 692px 1195px #fff,
    1976px 986px #fff, 835px 1090px #fff, 1722px 1531px #fff, 1788px 1423px #fff,
    15px 753px #fff, 899px 426px #fff, 1898px 1219px #fff, 1167px 560px #fff,
    1043px 163px #fff, 290px 1200px #fff, 1598px 1230px #fff, 1086px 1595px #fff,
    219px 980px #fff, 850px 1639px #fff, 113px 1356px #fff, 588px 1613px #fff,
    897px 310px #fff, 357px 1767px #fff, 1840px 1227px #fff, 279px 1159px #fff,
    1682px 704px #fff, 585px 1497px #fff, 757px 1598px #fff, 1446px 1803px #fff,
    583px 187px #fff, 599px 292px #fff, 1164px 228px #fff, 65px 1067px #fff,
    349px 976px #fff, 703px 355px #fff, 668px 1139px #fff, 481px 75px #fff,
    548px 694px #fff, 1275px 107px #fff, 281px 315px #fff, 1770px 607px #fff,
    341px 1677px #fff, 1781px 83px #fff, 218px 1179px #fff, 1270px 1867px #fff,
    1332px 1999px #fff, 952px 130px #fff, 1297px 1329px #fff, 1652px 1455px #fff,
    1745px 1064px #fff, 1948px 537px #fff, 972px 1136px #fff, 1189px 1043px #fff,
    579px 550px #fff, 1882px 801px #fff, 87px 848px #fff, 793px 452px #fff,
    923px 1956px #fff, 18px 1290px #fff, 895px 1757px #fff, 1928px 1385px #fff,
    1034px 1539px #fff, 1390px 116px #fff, 615px 1872px #fff, 1538px 105px #fff,
    769px 1446px #fff, 1950px 1755px #fff, 278px 1315px #fff, 814px 1176px #fff,
    21px 1035px #fff, 365px 1083px #fff, 223px 1047px #fff, 1418px 658px #fff,
    1321px 1343px #fff, 381px 1861px #fff, 921px 219px #fff, 878px 584px #fff,
    864px 414px #fff, 11px 664px #fff, 1448px 691px #fff, 476px 595px #fff,
    1493px 1133px #fff, 1947px 1710px #fff, 613px 448px #fff, 139px 864px #fff,
    8px 92px #fff, 599px 524px #fff, 322px 127px #fff, 609px 485px #fff,
    538px 1893px #fff, 1445px 1200px #fff, 321px 1866px #fff, 377px 355px #fff,
    438px 1651px #fff, 221px 1659px #fff, 1784px 319px #fff, 1564px 877px #fff,
    101px 351px #fff, 1273px 762px #fff, 1712px 541px #fff, 326px 537px #fff,
    1947px 1757px #fff, 1491px 789px #fff, 1880px 501px #fff, 1850px 1120px #fff,
    1338px 1749px #fff, 1763px 1399px #fff, 1641px 723px #fff, 1910px 55px #fff,
    1692px 1429px #fff, 1193px 685px #fff, 1776px 1635px #fff,
    1338px 1098px #fff, 1893px 1612px #fff, 192px 738px #fff, 1921px 1588px #fff,
    1883px 1892px #fff, 790px 216px #fff, 1559px 981px #fff, 1484px 900px #fff,
    666px 414px #fff, 1026px 118px #fff, 124px 656px #fff, 1103px 1926px #fff,
    235px 152px #fff, 283px 1818px #fff, 759px 1146px #fff, 536px 1963px #fff,
    277px 1066px #fff, 806px 722px #fff, 1762px 1529px #fff, 464px 1721px #fff,
    1252px 1545px #fff, 1786px 644px #fff, 444px 664px #fff, 1356px 1503px #fff,
    1656px 1914px #fff, 1403px 406px #fff, 773px 1960px #fff, 631px 1316px #fff,
    1437px 744px #fff, 312px 1279px #fff, 956px 1899px #fff, 919px 1757px #fff,
    1938px 520px #fff, 34px 1697px #fff, 139px 751px #fff, 1902px 1572px #fff,
    917px 192px #fff, 951px 413px #fff, 1213px 1035px #fff, 1603px 263px #fff,
    196px 645px #fff, 609px 1410px #fff, 155px 1030px #fff, 533px 1400px #fff,
    397px 662px #fff, 1484px 1295px #fff, 885px 1010px #fff, 1589px 1751px #fff,
    1350px 5px #fff, 1737px 215px #fff, 577px 156px #fff, 1806px 591px #fff,
    147px 1587px #fff, 130px 1029px #fff, 1483px 235px #fff, 1547px 915px #fff,
    642px 517px #fff, 714px 1667px #fff, 1190px 263px #fff, 166px 393px #fff,
    1123px 1882px #fff, 840px 831px #fff, 1526px 21px #fff, 1614px 94px #fff,
    1752px 974px #fff, 1794px 1316px #fff, 1137px 875px #fff, 1496px 1211px #fff,
    893px 512px #fff, 519px 354px #fff, 382px 952px #fff, 1646px 1799px #fff,
    567px 962px #fff, 1368px 458px #fff, 737px 1498px #fff, 1196px 1259px #fff,
    195px 1281px #fff, 782px 754px #fff, 1474px 501px #fff, 83px 947px #fff,
    1423px 1292px #fff, 1409px 1559px #fff, 943px 1557px #fff, 63px 7px #fff,
    851px 1198px #fff, 1621px 1786px #fff, 279px 1644px #fff, 1898px 490px #fff,
    1914px 1825px #fff, 529px 1026px #fff, 409px 1911px #fff, 260px 612px #fff,
    719px 1272px #fff, 263px 1435px #fff, 1139px 1970px #fff, 1712px 575px #fff,
    1424px 1468px #fff, 313px 1319px #fff, 151px 1849px #fff, 841px 1154px #fff,
    480px 1854px #fff, 1340px 855px #fff, 1535px 482px #fff, 990px 785px #fff,
    172px 962px #fff, 1470px 196px #fff, 46px 709px #fff, 1285px 835px #fff,
    1783px 1856px #fff, 872px 929px #fff, 1911px 735px #fff, 1422px 328px #fff,
    640px 1922px #fff, 709px 1820px #fff, 1962px 857px #fff, 415px 1571px #fff,
    134px 1181px #fff, 1348px 552px #fff, 641px 1109px #fff, 903px 118px #fff,
    643px 1321px #fff, 1628px 397px #fff, 343px 1739px #fff, 274px 1016px #fff,
    983px 193px #fff, 1075px 862px #fff, 1120px 1827px #fff, 771px 459px #fff,
    153px 1285px #fff, 170px 293px #fff, 996px 763px #fff, 444px 1832px #fff,
    1255px 1114px #fff, 219px 1557px #fff, 258px 1954px #fff, 178px 444px #fff,
    1732px 493px #fff, 1235px 782px #fff, 231px 1817px #fff, 1182px 1855px #fff,
    1025px 279px #fff, 1884px 195px #fff, 493px 57px #fff, 1186px 1822px #fff,
    1447px 1742px #fff, 1002px 1544px #fff, 289px 1994px #fff,
    1929px 1144px #fff, 1088px 319px #fff, 800px 1914px #fff, 1166px 831px #fff,
    532px 1362px #fff, 1574px 773px #fff, 1775px 1370px #fff, 612px 650px #fff,
    1348px 811px #fff, 844px 55px #fff, 552px 1137px #fff, 31px 1366px #fff,
    749px 613px #fff, 1250px 478px #fff, 369px 1307px #fff, 1980px 739px #fff,
    1661px 248px #fff, 342px 278px #fff, 477px 354px #fff, 463px 1266px #fff,
    1060px 1275px #fff, 1679px 1423px #fff, 245px 1368px #fff, 853px 1288px #fff,
    945px 856px #fff, 449px 1201px #fff, 1898px 1978px #fff, 197px 985px #fff,
    1210px 555px #fff, 1453px 1196px #fff, 1445px 683px #fff, 1056px 262px #fff,
    1968px 419px #fff, 759px 311px #fff, 1810px 525px #fff, 265px 959px #fff,
    1703px 1462px #fff, 1659px 233px #fff, 1249px 226px #fff, 880px 1px #fff,
    66px 405px #fff, 321px 1074px #fff, 1608px 160px #fff, 139px 975px #fff,
    1872px 1165px #fff, 754px 1769px #fff, 864px 326px #fff, 1018px 1345px #fff,
    1257px 1125px #fff, 288px 400px #fff, 1715px 1036px #fff, 958px 1352px #fff,
    1511px 293px #fff, 204px 1680px #fff, 46px 1844px #fff, 1766px 1318px #fff,
    475px 1311px #fff, 493px 471px #fff, 1751px 1298px #fff, 1570px 771px #fff,
    1941px 709px #fff, 403px 524px #fff, 1514px 64px #fff, 1700px 1790px #fff,
    1407px 1565px #fff, 1323px 1899px #fff, 272px 1900px #fff, 210px 188px #fff,
    339px 1947px #fff, 612px 565px #fff, 853px 913px #fff, 1110px 286px #fff,
    117px 1583px #fff, 1082px 98px #fff, 965px 940px #fff, 696px 361px #fff,
    1776px 633px #fff, 1744px 1447px #fff, 151px 82px #fff, 236px 731px #fff,
    96px 1401px #fff, 1697px 174px #fff, 973px 1181px #fff, 852px 680px #fff,
    1933px 174px #fff, 1838px 76px #fff, 154px 1540px #fff, 1370px 1369px #fff,
    925px 327px #fff, 664px 1070px #fff, 404px 1764px #fff, 1466px 1847px #fff,
    1945px 1045px #fff, 92px 1763px #fff, 1824px 915px #fff, 37px 1250px #fff,
    1590px 916px #fff, 756px 1424px #fff, 1587px 310px #fff, 1716px 1740px #fff,
    1243px 1984px #fff, 321px 930px #fff, 2000px 1459px #fff, 809px 390px #fff,
    901px 1322px #fff, 959px 1776px #fff, 1169px 676px #fff, 1810px 1311px #fff,
    467px 1316px #fff, 293px 1137px #fff, 1698px 679px #fff, 567px 134px #fff,
    958px 970px #fff, 772px 123px #fff, 306px 1874px #fff, 1796px 1129px #fff,
    320px 1216px #fff, 717px 430px #fff, 1613px 1091px #fff, 676px 814px #fff,
    1112px 1374px #fff, 551px 194px #fff, 433px 1999px #fff, 765px 1776px #fff,
    1376px 1956px #fff, 313px 1491px #fff, 1282px 97px #fff, 1990px 653px #fff,
    1439px 141px #fff, 1993px 1894px #fff, 1376px 482px #fff, 1900px 596px #fff,
    43px 1795px #fff, 1598px 1066px #fff, 1933px 1986px #fff, 1822px 698px #fff,
    1044px 1328px #fff, 1765px 136px #fff, 206px 784px #fff, 1580px 1056px #fff,
    241px 113px #fff, 420px 379px #fff, 1350px 1763px #fff, 786px 544px #fff,
    1000px 1122px #fff, 1015px 1078px #fff, 108px 543px #fff, 408px 761px #fff,
    1633px 1104px #fff, 214px 1340px #fff, 1720px 793px #fff, 1168px 1925px #fff,
    1164px 1538px #fff, 1253px 461px #fff, 1879px 1579px #fff, 1620px 624px #fff,
    1988px 737px #fff, 82px 635px #fff, 1840px 584px #fff, 100px 298px #fff,
    1649px 1873px #fff, 560px 835px #fff, 1959px 751px #fff, 348px 1698px #fff,
    1887px 426px #fff, 1609px 125px #fff, 1673px 1151px #fff, 491px 1222px #fff,
    1644px 1868px #fff, 870px 699px #fff, 168px 1254px #fff, 1777px 79px #fff,
    1334px 611px #fff, 709px 19px #fff, 1750px 427px #fff, 1803px 1045px #fff,
    1022px 1493px #fff, 234px 97px #fff, 677px 982px #fff, 591px 1236px #fff,
    650px 423px #fff, 210px 1156px #fff, 62px 467px #fff, 1180px 1774px #fff,
    1044px 1901px #fff, 673px 1754px #fff, 200px 1846px #fff, 120px 433px #fff,
    254px 684px #fff, 1840px 1213px #fff, 906px 1217px #fff, 147px 872px #fff,
    351px 327px #fff, 126px 83px #fff, 114px 993px #fff, 1993px 1043px #fff,
    552px 1851px #fff, 843px 1477px #fff, 143px 1194px #fff, 58px 661px #fff,
    572px 1174px #fff, 465px 34px #fff, 37px 501px #fff, 883px 317px #fff,
    638px 54px #fff, 474px 838px #fff, 1825px 1851px #fff, 508px 955px #fff,
    1972px 830px #fff, 1728px 1894px #fff, 1241px 1133px #fff, 274px 823px #fff,
    1930px 529px #fff, 1951px 1931px #fff, 1538px 1519px #fff,
    1885px 1501px #fff, 1510px 1178px #fff, 517px 567px #fff, 505px 1980px #fff,
    1979px 542px #fff, 69px 438px #fff, 1203px 1210px #fff, 1677px 696px #fff,
    1249px 1437px #fff, 1594px 699px #fff, 1719px 30px #fff, 1207px 96px #fff,
    1091px 1942px #fff, 1333px 1901px #fff, 574px 1699px #fff, 1px 1708px #fff,
    1920px 1022px #fff, 1992px 1704px #fff, 1450px 1072px #fff,
    117px 1672px #fff, 883px 869px #fff, 649px 641px #fff, 69px 604px #fff,
    135px 805px #fff, 1423px 135px #fff, 528px 828px #fff, 1044px 1298px #fff,
    608px 730px #fff, 696px 770px #fff, 23px 768px #fff, 926px 1459px #fff,
    116px 669px #fff, 1766px 1094px #fff, 1234px 906px #fff, 1384px 632px #fff,
    235px 204px #fff, 1265px 1757px #fff, 1139px 46px #fff, 824px 1913px #fff,
    1574px 1843px #fff, 1002px 1060px #fff, 773px 1354px #fff, 826px 1002px #fff,
    1828px 695px #fff, 160px 505px #fff, 1885px 1855px #fff, 1546px 643px #fff,
    398px 1154px #fff, 1465px 1749px #fff, 563px 50px #fff, 1909px 1889px #fff,
    1205px 1130px #fff, 1144px 248px #fff, 1788px 1189px #fff, 80px 1100px #fff,
    481px 1538px #fff, 528px 692px #fff, 998px 1165px #fff, 1484px 1462px #fff,
    804px 1538px #fff, 1644px 1277px #fff, 1371px 1258px #fff, 1662px 488px #fff,
    1962px 859px #fff, 1033px 1347px #fff, 450px 750px #fff, 42px 30px #fff,
    1337px 485px #fff, 573px 1264px #fff, 1443px 663px #fff, 1718px 1643px #fff,
    712px 3px #fff, 833px 1353px #fff, 1474px 672px #fff, 255px 673px #fff,
    871px 106px #fff, 590px 1561px #fff, 595px 1753px #fff, 464px 1764px #fff,
    858px 889px #fff, 1084px 1866px #fff, 476px 167px #fff, 876px 1952px #fff,
    781px 1690px #fff, 15px 1796px #fff;
  animation: animStar 50s linear infinite;
}
#stars:after {
  content: " ";
  position: absolute;
  /* top: 2000px; */
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 108px 405px #fff, 773px 892px #fff, 186px 744px #fff,
    1872px 956px #fff, 1514px 1612px #fff, 840px 748px #fff, 1330px 1172px #fff,
    1712px 1833px #fff, 973px 1258px #fff, 1640px 1934px #fff, 1961px 397px #fff,
    70px 208px #fff, 1878px 845px #fff, 1644px 1800px #fff, 108px 1357px #fff,
    991px 1421px #fff, 1451px 51px #fff, 1988px 1347px #fff, 835px 480px #fff,
    1454px 951px #fff, 724px 1553px #fff, 208px 865px #fff, 454px 1848px #fff,
    896px 1015px #fff, 85px 937px #fff, 1544px 1865px #fff, 1828px 414px #fff,
    1766px 377px #fff, 1993px 1454px #fff, 1189px 1600px #fff, 1030px 740px #fff,
    1280px 1768px #fff, 1053px 702px #fff, 363px 1518px #fff, 1498px 335px #fff,
    617px 1185px #fff, 788px 885px #fff, 596px 1201px #fff, 1015px 1374px #fff,
    478px 1338px #fff, 1726px 630px #fff, 1144px 1304px #fff, 1243px 365px #fff,
    749px 377px #fff, 149px 1431px #fff, 1305px 543px #fff, 821px 945px #fff,
    977px 1252px #fff, 420px 1268px #fff, 776px 1031px #fff, 334px 383px #fff,
    666px 1577px #fff, 1548px 1911px #fff, 408px 1191px #fff, 1711px 366px #fff,
    1179px 1693px #fff, 1631px 1453px #fff, 1951px 1285px #fff, 837px 414px #fff,
    155px 1641px #fff, 1164px 1311px #fff, 1430px 988px #fff, 1951px 448px #fff,
    1870px 557px #fff, 1613px 164px #fff, 1845px 738px #fff, 918px 1613px #fff,
    107px 1602px #fff, 458px 1941px #fff, 669px 504px #fff, 1003px 1251px #fff,
    15px 51px #fff, 771px 470px #fff, 66px 1101px #fff, 830px 859px #fff,
    1842px 286px #fff, 1968px 39px #fff, 730px 1866px #fff, 1157px 1044px #fff,
    651px 19px #fff, 1674px 1696px #fff, 1275px 1779px #fff, 1149px 1619px #fff,
    61px 726px #fff, 1701px 134px #fff, 1916px 937px #fff, 832px 192px #fff,
    1738px 132px #fff, 349px 1645px #fff, 771px 1921px #fff, 1658px 1097px #fff,
    219px 1169px #fff, 1831px 662px #fff, 273px 1147px #fff, 1080px 1543px #fff,
    1905px 1439px #fff, 755px 182px #fff, 1944px 1720px #fff, 407px 1807px #fff,
    1359px 1062px #fff, 1235px 1384px #fff, 226px 877px #fff, 1549px 583px #fff,
    1405px 1326px #fff, 1262px 1198px #fff, 1520px 1427px #fff,
    459px 1770px #fff, 1705px 653px #fff, 555px 895px #fff, 1243px 1984px #fff,
    69px 525px #fff, 22px 510px #fff, 645px 864px #fff, 1620px 246px #fff,
    1024px 1760px #fff, 1824px 844px #fff, 328px 1677px #fff, 1043px 1410px #fff,
    522px 1634px #fff, 796px 1394px #fff, 885px 1364px #fff, 349px 1873px #fff,
    489px 538px #fff, 1762px 1197px #fff, 1999px 1109px #fff, 535px 305px #fff,
    1429px 990px #fff, 1979px 1472px #fff, 853px 1911px #fff, 53px 747px #fff,
    1673px 4px #fff, 1989px 550px #fff, 437px 1859px #fff, 1186px 1037px #fff,
    1313px 1755px #fff, 1803px 49px #fff, 425px 1420px #fff, 243px 112px #fff,
    854px 1606px #fff, 1033px 158px #fff, 354px 659px #fff, 694px 290px #fff,
    195px 1442px #fff, 76px 457px #fff, 630px 53px #fff, 692px 1195px #fff,
    1976px 986px #fff, 835px 1090px #fff, 1722px 1531px #fff, 1788px 1423px #fff,
    15px 753px #fff, 899px 426px #fff, 1898px 1219px #fff, 1167px 560px #fff,
    1043px 163px #fff, 290px 1200px #fff, 1598px 1230px #fff, 1086px 1595px #fff,
    219px 980px #fff, 850px 1639px #fff, 113px 1356px #fff, 588px 1613px #fff,
    897px 310px #fff, 357px 1767px #fff, 1840px 1227px #fff, 279px 1159px #fff,
    1682px 704px #fff, 585px 1497px #fff, 757px 1598px #fff, 1446px 1803px #fff,
    583px 187px #fff, 599px 292px #fff, 1164px 228px #fff, 65px 1067px #fff,
    349px 976px #fff, 703px 355px #fff, 668px 1139px #fff, 481px 75px #fff,
    548px 694px #fff, 1275px 107px #fff, 281px 315px #fff, 1770px 607px #fff,
    341px 1677px #fff, 1781px 83px #fff, 218px 1179px #fff, 1270px 1867px #fff,
    1332px 1999px #fff, 952px 130px #fff, 1297px 1329px #fff, 1652px 1455px #fff,
    1745px 1064px #fff, 1948px 537px #fff, 972px 1136px #fff, 1189px 1043px #fff,
    579px 550px #fff, 1882px 801px #fff, 87px 848px #fff, 793px 452px #fff,
    923px 1956px #fff, 18px 1290px #fff, 895px 1757px #fff, 1928px 1385px #fff,
    1034px 1539px #fff, 1390px 116px #fff, 615px 1872px #fff, 1538px 105px #fff,
    769px 1446px #fff, 1950px 1755px #fff, 278px 1315px #fff, 814px 1176px #fff,
    21px 1035px #fff, 365px 1083px #fff, 223px 1047px #fff, 1418px 658px #fff,
    1321px 1343px #fff, 381px 1861px #fff, 921px 219px #fff, 878px 584px #fff,
    864px 414px #fff, 11px 664px #fff, 1448px 691px #fff, 476px 595px #fff,
    1493px 1133px #fff, 1947px 1710px #fff, 613px 448px #fff, 139px 864px #fff,
    8px 92px #fff, 599px 524px #fff, 322px 127px #fff, 609px 485px #fff,
    538px 1893px #fff, 1445px 1200px #fff, 321px 1866px #fff, 377px 355px #fff,
    438px 1651px #fff, 221px 1659px #fff, 1784px 319px #fff, 1564px 877px #fff,
    101px 351px #fff, 1273px 762px #fff, 1712px 541px #fff, 326px 537px #fff,
    1947px 1757px #fff, 1491px 789px #fff, 1880px 501px #fff, 1850px 1120px #fff,
    1338px 1749px #fff, 1763px 1399px #fff, 1641px 723px #fff, 1910px 55px #fff,
    1692px 1429px #fff, 1193px 685px #fff, 1776px 1635px #fff,
    1338px 1098px #fff, 1893px 1612px #fff, 192px 738px #fff, 1921px 1588px #fff,
    1883px 1892px #fff, 790px 216px #fff, 1559px 981px #fff, 1484px 900px #fff,
    666px 414px #fff, 1026px 118px #fff, 124px 656px #fff, 1103px 1926px #fff,
    235px 152px #fff, 283px 1818px #fff, 759px 1146px #fff, 536px 1963px #fff,
    277px 1066px #fff, 806px 722px #fff, 1762px 1529px #fff, 464px 1721px #fff,
    1252px 1545px #fff, 1786px 644px #fff, 444px 664px #fff, 1356px 1503px #fff,
    1656px 1914px #fff, 1403px 406px #fff, 773px 1960px #fff, 631px 1316px #fff,
    1437px 744px #fff, 312px 1279px #fff, 956px 1899px #fff, 919px 1757px #fff,
    1938px 520px #fff, 34px 1697px #fff, 139px 751px #fff, 1902px 1572px #fff,
    917px 192px #fff, 951px 413px #fff, 1213px 1035px #fff, 1603px 263px #fff,
    196px 645px #fff, 609px 1410px #fff, 155px 1030px #fff, 533px 1400px #fff,
    397px 662px #fff, 1484px 1295px #fff, 885px 1010px #fff, 1589px 1751px #fff,
    1350px 5px #fff, 1737px 215px #fff, 577px 156px #fff, 1806px 591px #fff,
    147px 1587px #fff, 130px 1029px #fff, 1483px 235px #fff, 1547px 915px #fff,
    642px 517px #fff, 714px 1667px #fff, 1190px 263px #fff, 166px 393px #fff,
    1123px 1882px #fff, 840px 831px #fff, 1526px 21px #fff, 1614px 94px #fff,
    1752px 974px #fff, 1794px 1316px #fff, 1137px 875px #fff, 1496px 1211px #fff,
    893px 512px #fff, 519px 354px #fff, 382px 952px #fff, 1646px 1799px #fff,
    567px 962px #fff, 1368px 458px #fff, 737px 1498px #fff, 1196px 1259px #fff,
    195px 1281px #fff, 782px 754px #fff, 1474px 501px #fff, 83px 947px #fff,
    1423px 1292px #fff, 1409px 1559px #fff, 943px 1557px #fff, 63px 7px #fff,
    851px 1198px #fff, 1621px 1786px #fff, 279px 1644px #fff, 1898px 490px #fff,
    1914px 1825px #fff, 529px 1026px #fff, 409px 1911px #fff, 260px 612px #fff,
    719px 1272px #fff, 263px 1435px #fff, 1139px 1970px #fff, 1712px 575px #fff,
    1424px 1468px #fff, 313px 1319px #fff, 151px 1849px #fff, 841px 1154px #fff,
    480px 1854px #fff, 1340px 855px #fff, 1535px 482px #fff, 990px 785px #fff,
    172px 962px #fff, 1470px 196px #fff, 46px 709px #fff, 1285px 835px #fff,
    1783px 1856px #fff, 872px 929px #fff, 1911px 735px #fff, 1422px 328px #fff,
    640px 1922px #fff, 709px 1820px #fff, 1962px 857px #fff, 415px 1571px #fff,
    134px 1181px #fff, 1348px 552px #fff, 641px 1109px #fff, 903px 118px #fff,
    643px 1321px #fff, 1628px 397px #fff, 343px 1739px #fff, 274px 1016px #fff,
    983px 193px #fff, 1075px 862px #fff, 1120px 1827px #fff, 771px 459px #fff,
    153px 1285px #fff, 170px 293px #fff, 996px 763px #fff, 444px 1832px #fff,
    1255px 1114px #fff, 219px 1557px #fff, 258px 1954px #fff, 178px 444px #fff,
    1732px 493px #fff, 1235px 782px #fff, 231px 1817px #fff, 1182px 1855px #fff,
    1025px 279px #fff, 1884px 195px #fff, 493px 57px #fff, 1186px 1822px #fff,
    1447px 1742px #fff, 1002px 1544px #fff, 289px 1994px #fff,
    1929px 1144px #fff, 1088px 319px #fff, 800px 1914px #fff, 1166px 831px #fff,
    532px 1362px #fff, 1574px 773px #fff, 1775px 1370px #fff, 612px 650px #fff,
    1348px 811px #fff, 844px 55px #fff, 552px 1137px #fff, 31px 1366px #fff,
    749px 613px #fff, 1250px 478px #fff, 369px 1307px #fff, 1980px 739px #fff,
    1661px 248px #fff, 342px 278px #fff, 477px 354px #fff, 463px 1266px #fff,
    1060px 1275px #fff, 1679px 1423px #fff, 245px 1368px #fff, 853px 1288px #fff,
    945px 856px #fff, 449px 1201px #fff, 1898px 1978px #fff, 197px 985px #fff,
    1210px 555px #fff, 1453px 1196px #fff, 1445px 683px #fff, 1056px 262px #fff,
    1968px 419px #fff, 759px 311px #fff, 1810px 525px #fff, 265px 959px #fff,
    1703px 1462px #fff, 1659px 233px #fff, 1249px 226px #fff, 880px 1px #fff,
    66px 405px #fff, 321px 1074px #fff, 1608px 160px #fff, 139px 975px #fff,
    1872px 1165px #fff, 754px 1769px #fff, 864px 326px #fff, 1018px 1345px #fff,
    1257px 1125px #fff, 288px 400px #fff, 1715px 1036px #fff, 958px 1352px #fff,
    1511px 293px #fff, 204px 1680px #fff, 46px 1844px #fff, 1766px 1318px #fff,
    475px 1311px #fff, 493px 471px #fff, 1751px 1298px #fff, 1570px 771px #fff,
    1941px 709px #fff, 403px 524px #fff, 1514px 64px #fff, 1700px 1790px #fff,
    1407px 1565px #fff, 1323px 1899px #fff, 272px 1900px #fff, 210px 188px #fff,
    339px 1947px #fff, 612px 565px #fff, 853px 913px #fff, 1110px 286px #fff,
    117px 1583px #fff, 1082px 98px #fff, 965px 940px #fff, 696px 361px #fff,
    1776px 633px #fff, 1744px 1447px #fff, 151px 82px #fff, 236px 731px #fff,
    96px 1401px #fff, 1697px 174px #fff, 973px 1181px #fff, 852px 680px #fff,
    1933px 174px #fff, 1838px 76px #fff, 154px 1540px #fff, 1370px 1369px #fff,
    925px 327px #fff, 664px 1070px #fff, 404px 1764px #fff, 1466px 1847px #fff,
    1945px 1045px #fff, 92px 1763px #fff, 1824px 915px #fff, 37px 1250px #fff,
    1590px 916px #fff, 756px 1424px #fff, 1587px 310px #fff, 1716px 1740px #fff,
    1243px 1984px #fff, 321px 930px #fff, 2000px 1459px #fff, 809px 390px #fff,
    901px 1322px #fff, 959px 1776px #fff, 1169px 676px #fff, 1810px 1311px #fff,
    467px 1316px #fff, 293px 1137px #fff, 1698px 679px #fff, 567px 134px #fff,
    958px 970px #fff, 772px 123px #fff, 306px 1874px #fff, 1796px 1129px #fff,
    320px 1216px #fff, 717px 430px #fff, 1613px 1091px #fff, 676px 814px #fff,
    1112px 1374px #fff, 551px 194px #fff, 433px 1999px #fff, 765px 1776px #fff,
    1376px 1956px #fff, 313px 1491px #fff, 1282px 97px #fff, 1990px 653px #fff,
    1439px 141px #fff, 1993px 1894px #fff, 1376px 482px #fff, 1900px 596px #fff,
    43px 1795px #fff, 1598px 1066px #fff, 1933px 1986px #fff, 1822px 698px #fff,
    1044px 1328px #fff, 1765px 136px #fff, 206px 784px #fff, 1580px 1056px #fff,
    241px 113px #fff, 420px 379px #fff, 1350px 1763px #fff, 786px 544px #fff,
    1000px 1122px #fff, 1015px 1078px #fff, 108px 543px #fff, 408px 761px #fff,
    1633px 1104px #fff, 214px 1340px #fff, 1720px 793px #fff, 1168px 1925px #fff,
    1164px 1538px #fff, 1253px 461px #fff, 1879px 1579px #fff, 1620px 624px #fff,
    1988px 737px #fff, 82px 635px #fff, 1840px 584px #fff, 100px 298px #fff,
    1649px 1873px #fff, 560px 835px #fff, 1959px 751px #fff, 348px 1698px #fff,
    1887px 426px #fff, 1609px 125px #fff, 1673px 1151px #fff, 491px 1222px #fff,
    1644px 1868px #fff, 870px 699px #fff, 168px 1254px #fff, 1777px 79px #fff,
    1334px 611px #fff, 709px 19px #fff, 1750px 427px #fff, 1803px 1045px #fff,
    1022px 1493px #fff, 234px 97px #fff, 677px 982px #fff, 591px 1236px #fff,
    650px 423px #fff, 210px 1156px #fff, 62px 467px #fff, 1180px 1774px #fff,
    1044px 1901px #fff, 673px 1754px #fff, 200px 1846px #fff, 120px 433px #fff,
    254px 684px #fff, 1840px 1213px #fff, 906px 1217px #fff, 147px 872px #fff,
    351px 327px #fff, 126px 83px #fff, 114px 993px #fff, 1993px 1043px #fff,
    552px 1851px #fff, 843px 1477px #fff, 143px 1194px #fff, 58px 661px #fff,
    572px 1174px #fff, 465px 34px #fff, 37px 501px #fff, 883px 317px #fff,
    638px 54px #fff, 474px 838px #fff, 1825px 1851px #fff, 508px 955px #fff,
    1972px 830px #fff, 1728px 1894px #fff, 1241px 1133px #fff, 274px 823px #fff,
    1930px 529px #fff, 1951px 1931px #fff, 1538px 1519px #fff,
    1885px 1501px #fff, 1510px 1178px #fff, 517px 567px #fff, 505px 1980px #fff,
    1979px 542px #fff, 69px 438px #fff, 1203px 1210px #fff, 1677px 696px #fff,
    1249px 1437px #fff, 1594px 699px #fff, 1719px 30px #fff, 1207px 96px #fff,
    1091px 1942px #fff, 1333px 1901px #fff, 574px 1699px #fff, 1px 1708px #fff,
    1920px 1022px #fff, 1992px 1704px #fff, 1450px 1072px #fff,
    117px 1672px #fff, 883px 869px #fff, 649px 641px #fff, 69px 604px #fff,
    135px 805px #fff, 1423px 135px #fff, 528px 828px #fff, 1044px 1298px #fff,
    608px 730px #fff, 696px 770px #fff, 23px 768px #fff, 926px 1459px #fff,
    116px 669px #fff, 1766px 1094px #fff, 1234px 906px #fff, 1384px 632px #fff,
    235px 204px #fff, 1265px 1757px #fff, 1139px 46px #fff, 824px 1913px #fff,
    1574px 1843px #fff, 1002px 1060px #fff, 773px 1354px #fff, 826px 1002px #fff,
    1828px 695px #fff, 160px 505px #fff, 1885px 1855px #fff, 1546px 643px #fff,
    398px 1154px #fff, 1465px 1749px #fff, 563px 50px #fff, 1909px 1889px #fff,
    1205px 1130px #fff, 1144px 248px #fff, 1788px 1189px #fff, 80px 1100px #fff,
    481px 1538px #fff, 528px 692px #fff, 998px 1165px #fff, 1484px 1462px #fff,
    804px 1538px #fff, 1644px 1277px #fff, 1371px 1258px #fff, 1662px 488px #fff,
    1962px 859px #fff, 1033px 1347px #fff, 450px 750px #fff, 42px 30px #fff,
    1337px 485px #fff, 573px 1264px #fff, 1443px 663px #fff, 1718px 1643px #fff,
    712px 3px #fff, 833px 1353px #fff, 1474px 672px #fff, 255px 673px #fff,
    871px 106px #fff, 590px 1561px #fff, 595px 1753px #fff, 464px 1764px #fff,
    858px 889px #fff, 1084px 1866px #fff, 476px 167px #fff, 876px 1952px #fff,
    781px 1690px #fff, 15px 1796px #fff;
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: 53px 1920px #fff, 494px 615px #fff, 1090px 1672px #fff,
    659px 865px #fff, 1529px 119px #fff, 761px 140px #fff, 1204px 1037px #fff,
    60px 1335px #fff, 789px 1088px #fff, 404px 1614px #fff, 29px 1844px #fff,
    996px 409px #fff, 1467px 1081px #fff, 179px 804px #fff, 1785px 1370px #fff,
    1020px 331px #fff, 1543px 1080px #fff, 791px 1483px #fff, 1543px 217px #fff,
    1511px 842px #fff, 1908px 267px #fff, 1797px 1495px #fff, 3px 662px #fff,
    943px 1502px #fff, 1611px 1530px #fff, 1470px 1563px #fff, 1782px 734px #fff,
    1641px 582px #fff, 1294px 1818px #fff, 1796px 640px #fff, 1728px 1221px #fff,
    463px 58px #fff, 981px 761px #fff, 1883px 1618px #fff, 1067px 296px #fff,
    1925px 1007px #fff, 1491px 977px #fff, 933px 696px #fff, 1921px 1747px #fff,
    1553px 202px #fff, 1432px 1347px #fff, 718px 1527px #fff, 765px 1998px #fff,
    1536px 303px #fff, 746px 1548px #fff, 1954px 1858px #fff, 77px 1004px #fff,
    295px 19px #fff, 52px 475px #fff, 345px 1184px #fff, 132px 1057px #fff,
    1658px 1697px #fff, 1747px 1301px #fff, 1397px 1797px #fff,
    1556px 1848px #fff, 1618px 314px #fff, 1755px 1962px #fff, 610px 1743px #fff,
    1882px 612px #fff, 482px 88px #fff, 128px 1686px #fff, 1093px 1207px #fff,
    1103px 1128px #fff, 666px 999px #fff, 1368px 1069px #fff, 1480px 108px #fff,
    1316px 360px #fff, 866px 1472px #fff, 551px 1552px #fff, 1634px 199px #fff,
    954px 1060px #fff, 1201px 1880px #fff, 730px 1411px #fff, 1434px 1492px #fff,
    1662px 204px #fff, 352px 1005px #fff, 1810px 100px #fff, 669px 1840px #fff,
    738px 1647px #fff, 94px 148px #fff, 557px 385px #fff, 203px 34px #fff,
    788px 1557px #fff, 649px 1562px #fff, 776px 1003px #fff, 1604px 232px #fff,
    641px 827px #fff, 934px 1119px #fff, 604px 596px #fff, 1674px 1809px #fff,
    249px 117px #fff, 212px 275px #fff, 1397px 603px #fff, 39px 1776px #fff,
    1484px 709px #fff, 1293px 299px #fff, 1058px 242px #fff, 982px 1790px #fff,
    714px 267px #fff, 326px 357px #fff, 905px 1619px #fff, 667px 863px #fff,
    971px 1553px #fff, 866px 136px #fff, 6px 785px #fff, 1418px 316px #fff,
    324px 581px #fff, 36px 241px #fff, 557px 1274px #fff, 1389px 180px #fff,
    1598px 1296px #fff, 1698px 1095px #fff, 396px 705px #fff, 536px 1316px #fff,
    1283px 1634px #fff, 1156px 327px #fff, 787px 753px #fff, 1740px 807px #fff,
    554px 1183px #fff, 920px 1840px #fff, 583px 1964px #fff, 955px 182px #fff,
    613px 356px #fff, 810px 1207px #fff, 1552px 296px #fff, 1271px 961px #fff,
    1503px 912px #fff, 717px 1920px #fff, 347px 1886px #fff, 97px 1152px #fff,
    842px 1069px #fff, 745px 638px #fff, 1309px 1731px #fff, 91px 812px #fff,
    392px 63px #fff, 875px 1457px #fff, 417px 47px #fff, 1255px 606px #fff,
    1274px 323px #fff, 173px 723px #fff, 1072px 877px #fff, 1773px 1978px #fff,
    689px 1602px #fff, 104px 1555px #fff, 1881px 1264px #fff, 1021px 1929px #fff,
    1846px 1007px #fff, 1699px 557px #fff, 1657px 1706px #fff, 414px 405px #fff,
    1023px 945px #fff, 505px 1116px #fff, 1467px 961px #fff, 303px 1933px #fff,
    1488px 1123px #fff, 1015px 721px #fff, 1187px 462px #fff, 463px 1978px #fff,
    21px 731px #fff, 724px 1616px #fff, 1679px 839px #fff, 693px 1662px #fff,
    1786px 71px #fff, 97px 1310px #fff, 1141px 1091px #fff, 1727px 1769px #fff,
    1701px 245px #fff, 1422px 13px #fff, 1015px 180px #fff, 550px 877px #fff,
    1264px 453px #fff, 859px 170px #fff, 1616px 344px #fff, 185px 887px #fff,
    812px 903px #fff, 1270px 267px #fff, 276px 1029px #fff, 523px 101px #fff,
    1843px 1746px #fff, 1988px 611px #fff, 1282px 1275px #fff,
    1011px 1285px #fff, 1916px 1091px #fff, 1209px 1196px #fff,
    1930px 447px #fff, 1472px 660px #fff, 338px 484px #fff, 1946px 578px #fff,
    1720px 1975px #fff, 1919px 1411px #fff, 1701px 1705px #fff, 679px 541px #fff,
    990px 1785px #fff, 476px 41px #fff, 132px 1858px #fff, 1023px 1460px #fff,
    1539px 644px #fff, 1503px 311px #fff, 651px 1520px #fff, 1464px 392px #fff;
  animation: animStar 100s linear infinite;
}
#stars2:after {
  content: " ";
  position: absolute;
  /* top: 2000px; */
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: 53px 1920px #fff, 494px 615px #fff, 1090px 1672px #fff,
    659px 865px #fff, 1529px 119px #fff, 761px 140px #fff, 1204px 1037px #fff,
    60px 1335px #fff, 789px 1088px #fff, 404px 1614px #fff, 29px 1844px #fff,
    996px 409px #fff, 1467px 1081px #fff, 179px 804px #fff, 1785px 1370px #fff,
    1020px 331px #fff, 1543px 1080px #fff, 791px 1483px #fff, 1543px 217px #fff,
    1511px 842px #fff, 1908px 267px #fff, 1797px 1495px #fff, 3px 662px #fff,
    943px 1502px #fff, 1611px 1530px #fff, 1470px 1563px #fff, 1782px 734px #fff,
    1641px 582px #fff, 1294px 1818px #fff, 1796px 640px #fff, 1728px 1221px #fff,
    463px 58px #fff, 981px 761px #fff, 1883px 1618px #fff, 1067px 296px #fff,
    1925px 1007px #fff, 1491px 977px #fff, 933px 696px #fff, 1921px 1747px #fff,
    1553px 202px #fff, 1432px 1347px #fff, 718px 1527px #fff, 765px 1998px #fff,
    1536px 303px #fff, 746px 1548px #fff, 1954px 1858px #fff, 77px 1004px #fff,
    295px 19px #fff, 52px 475px #fff, 345px 1184px #fff, 132px 1057px #fff,
    1658px 1697px #fff, 1747px 1301px #fff, 1397px 1797px #fff,
    1556px 1848px #fff, 1618px 314px #fff, 1755px 1962px #fff, 610px 1743px #fff,
    1882px 612px #fff, 482px 88px #fff, 128px 1686px #fff, 1093px 1207px #fff,
    1103px 1128px #fff, 666px 999px #fff, 1368px 1069px #fff, 1480px 108px #fff,
    1316px 360px #fff, 866px 1472px #fff, 551px 1552px #fff, 1634px 199px #fff,
    954px 1060px #fff, 1201px 1880px #fff, 730px 1411px #fff, 1434px 1492px #fff,
    1662px 204px #fff, 352px 1005px #fff, 1810px 100px #fff, 669px 1840px #fff,
    738px 1647px #fff, 94px 148px #fff, 557px 385px #fff, 203px 34px #fff,
    788px 1557px #fff, 649px 1562px #fff, 776px 1003px #fff, 1604px 232px #fff,
    641px 827px #fff, 934px 1119px #fff, 604px 596px #fff, 1674px 1809px #fff,
    249px 117px #fff, 212px 275px #fff, 1397px 603px #fff, 39px 1776px #fff,
    1484px 709px #fff, 1293px 299px #fff, 1058px 242px #fff, 982px 1790px #fff,
    714px 267px #fff, 326px 357px #fff, 905px 1619px #fff, 667px 863px #fff,
    971px 1553px #fff, 866px 136px #fff, 6px 785px #fff, 1418px 316px #fff,
    324px 581px #fff, 36px 241px #fff, 557px 1274px #fff, 1389px 180px #fff,
    1598px 1296px #fff, 1698px 1095px #fff, 396px 705px #fff, 536px 1316px #fff,
    1283px 1634px #fff, 1156px 327px #fff, 787px 753px #fff, 1740px 807px #fff,
    554px 1183px #fff, 920px 1840px #fff, 583px 1964px #fff, 955px 182px #fff,
    613px 356px #fff, 810px 1207px #fff, 1552px 296px #fff, 1271px 961px #fff,
    1503px 912px #fff, 717px 1920px #fff, 347px 1886px #fff, 97px 1152px #fff,
    842px 1069px #fff, 745px 638px #fff, 1309px 1731px #fff, 91px 812px #fff,
    392px 63px #fff, 875px 1457px #fff, 417px 47px #fff, 1255px 606px #fff,
    1274px 323px #fff, 173px 723px #fff, 1072px 877px #fff, 1773px 1978px #fff,
    689px 1602px #fff, 104px 1555px #fff, 1881px 1264px #fff, 1021px 1929px #fff,
    1846px 1007px #fff, 1699px 557px #fff, 1657px 1706px #fff, 414px 405px #fff,
    1023px 945px #fff, 505px 1116px #fff, 1467px 961px #fff, 303px 1933px #fff,
    1488px 1123px #fff, 1015px 721px #fff, 1187px 462px #fff, 463px 1978px #fff,
    21px 731px #fff, 724px 1616px #fff, 1679px 839px #fff, 693px 1662px #fff,
    1786px 71px #fff, 97px 1310px #fff, 1141px 1091px #fff, 1727px 1769px #fff,
    1701px 245px #fff, 1422px 13px #fff, 1015px 180px #fff, 550px 877px #fff,
    1264px 453px #fff, 859px 170px #fff, 1616px 344px #fff, 185px 887px #fff,
    812px 903px #fff, 1270px 267px #fff, 276px 1029px #fff, 523px 101px #fff,
    1843px 1746px #fff, 1988px 611px #fff, 1282px 1275px #fff,
    1011px 1285px #fff, 1916px 1091px #fff, 1209px 1196px #fff,
    1930px 447px #fff, 1472px 660px #fff, 338px 484px #fff, 1946px 578px #fff,
    1720px 1975px #fff, 1919px 1411px #fff, 1701px 1705px #fff, 679px 541px #fff,
    990px 1785px #fff, 476px 41px #fff, 132px 1858px #fff, 1023px 1460px #fff,
    1539px 644px #fff, 1503px 311px #fff, 651px 1520px #fff, 1464px 392px #fff;
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: 1904px 1858px #fff, 1115px 1167px #fff, 156px 1507px #fff,
    953px 1078px #fff, 443px 312px #fff, 849px 659px #fff, 38px 485px #fff,
    1991px 1857px #fff, 1984px 367px #fff, 193px 1621px #fff, 1323px 1245px #fff,
    161px 1280px #fff, 540px 1120px #fff, 760px 953px #fff, 358px 1582px #fff,
    151px 1506px #fff, 460px 1947px #fff, 1945px 693px #fff, 1439px 357px #fff,
    765px 679px #fff, 1802px 1407px #fff, 1109px 1701px #fff, 391px 1525px #fff,
    161px 1177px #fff, 1721px 1130px #fff, 771px 1917px #fff, 1970px 1540px #fff,
    131px 926px #fff, 1069px 39px #fff, 139px 1499px #fff, 380px 368px #fff,
    1556px 1397px #fff, 826px 457px #fff, 819px 924px #fff, 389px 1995px #fff,
    1022px 562px #fff, 587px 1009px #fff, 1594px 1960px #fff, 111px 1311px #fff,
    1559px 1799px #fff, 535px 1710px #fff, 300px 1408px #fff, 11px 795px #fff,
    656px 34px #fff, 65px 1677px #fff, 713px 490px #fff, 1055px 1064px #fff,
    846px 1322px #fff, 1828px 756px #fff, 683px 1290px #fff, 45px 1268px #fff,
    1755px 548px #fff, 28px 430px #fff, 1516px 341px #fff, 1148px 1656px #fff,
    796px 417px #fff, 358px 650px #fff, 1974px 11px #fff, 1001px 470px #fff,
    817px 1272px #fff, 681px 976px #fff, 35px 1819px #fff, 1509px 885px #fff,
    1868px 1487px #fff, 450px 691px #fff, 1203px 821px #fff, 1893px 1593px #fff,
    1633px 1500px #fff, 1888px 704px #fff, 1893px 1726px #fff, 253px 1887px #fff,
    653px 441px #fff, 1107px 1316px #fff, 765px 1296px #fff, 1464px 423px #fff,
    5px 1077px #fff, 1544px 674px #fff, 1964px 1553px #fff, 424px 342px #fff,
    1213px 446px #fff, 82px 29px #fff, 149px 888px #fff, 939px 1215px #fff,
    67px 168px #fff, 1336px 1145px #fff, 389px 1832px #fff, 1893px 1706px #fff,
    1223px 1055px #fff, 1158px 1797px #fff, 705px 1207px #fff,
    1289px 1395px #fff, 1087px 255px #fff, 412px 985px #fff, 792px 1062px #fff,
    142px 1306px #fff, 1445px 223px #fff, 199px 481px #fff, 1214px 983px #fff,
    405px 211px #fff, 647px 1228px #fff;
  animation: animStar 150s linear infinite;
}
#stars3:after {
  content: " ";
  position: absolute;
  /* top: 2000px; */
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: 1904px 1858px #fff, 1115px 1167px #fff, 156px 1507px #fff,
    953px 1078px #fff, 443px 312px #fff, 849px 659px #fff, 38px 485px #fff,
    1991px 1857px #fff, 1984px 367px #fff, 193px 1621px #fff, 1323px 1245px #fff,
    161px 1280px #fff, 540px 1120px #fff, 760px 953px #fff, 358px 1582px #fff,
    151px 1506px #fff, 460px 1947px #fff, 1945px 693px #fff, 1439px 357px #fff,
    765px 679px #fff, 1802px 1407px #fff, 1109px 1701px #fff, 391px 1525px #fff,
    161px 1177px #fff, 1721px 1130px #fff, 771px 1917px #fff, 1970px 1540px #fff,
    131px 926px #fff, 1069px 39px #fff, 139px 1499px #fff, 380px 368px #fff,
    1556px 1397px #fff, 826px 457px #fff, 819px 924px #fff, 389px 1995px #fff,
    1022px 562px #fff, 587px 1009px #fff, 1594px 1960px #fff, 111px 1311px #fff,
    1559px 1799px #fff, 535px 1710px #fff, 300px 1408px #fff, 11px 795px #fff,
    656px 34px #fff, 65px 1677px #fff, 713px 490px #fff, 1055px 1064px #fff,
    846px 1322px #fff, 1828px 756px #fff, 683px 1290px #fff, 45px 1268px #fff,
    1755px 548px #fff, 28px 430px #fff, 1516px 341px #fff, 1148px 1656px #fff,
    796px 417px #fff, 358px 650px #fff, 1974px 11px #fff, 1001px 470px #fff,
    817px 1272px #fff, 681px 976px #fff, 35px 1819px #fff, 1509px 885px #fff,
    1868px 1487px #fff, 450px 691px #fff, 1203px 821px #fff, 1893px 1593px #fff,
    1633px 1500px #fff, 1888px 704px #fff, 1893px 1726px #fff, 253px 1887px #fff,
    653px 441px #fff, 1107px 1316px #fff, 765px 1296px #fff, 1464px 423px #fff,
    5px 1077px #fff, 1544px 674px #fff, 1964px 1553px #fff, 424px 342px #fff,
    1213px 446px #fff, 82px 29px #fff, 149px 888px #fff, 939px 1215px #fff,
    67px 168px #fff, 1336px 1145px #fff, 389px 1832px #fff, 1893px 1706px #fff,
    1223px 1055px #fff, 1158px 1797px #fff, 705px 1207px #fff,
    1289px 1395px #fff, 1087px 255px #fff, 412px 985px #fff, 792px 1062px #fff,
    142px 1306px #fff, 1445px 223px #fff, 199px 481px #fff, 1214px 983px #fff,
    405px 211px #fff, 647px 1228px #fff;
}

#title {
  left: 0;
  right: 0;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  font-size: 50px;
  letter-spacing: 10px;
  padding-left: 10px;
}
#title span {
  background: -webkit-linear-gradient(white, #38495a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}

.my-btn {
  cursor: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/9632/happy.png"),
    auto !important;
  border-radius: 0px;
  -webkit-box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
  -moz-box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
  box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
}
</style>

<script>
import axios from "axios";
import AddFamily from "../modals/AddFamily";

import { touchRipple } from "vue-touch-ripple";
import { VueTyper } from "vue-typer";
import "vue-touch-ripple/dist/vue-touch-ripple.css";

export default {
  data() {
    return {
      info: null,
      loading: true,
      errored: false,
      callMe: false,
      showModal: false
    };
  },
  components: {
    AddFamily,
    touchRipple,
    VueTyper
  },
  methods: {
    addFamily() {
      console.log("adding family");
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;

      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    }
  },
  destroyed() {
    this.toggleBodyClass("removeClass", "j-stars");
  },
  mounted() {
    axios
      .get("https://blineapi.herokuapp.com/meta")
      .then(response => {
        this.toggleBodyClass("addClass", "j-stars");
        this.info = response.data;
      })
      .catch(error => {
        this.errored = error;
        console.log(error);
      })
      .finally(() => (this.loading = false));
  }
};
</script>


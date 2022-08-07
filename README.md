#  Stellar Explorer
 [! [ Trạng thái bản dựng ] (https://travis-ci.org/chatch/stellarexplorer.svg?branch=master)] (https://travis-ci.org/chatch/stellarexplorer)
 Một công cụ khám phá sổ cái cho [ Stellar ] (https://stellar.org).
 Công khai: https://steexp.com
 Kiểm tra: https://testnet.steexp.com
 Địa phương: http: // localhost: 3000
 ##  Tài nguyên
 ###  Danh sách
 | Tài nguyên | URI |
 | ------------ | -------------------------------------------- |
 | Hoạt động | [/operations](https://steexp.com/operations) |
 | Giao dịch | [/txs](https://steexp.com/txs) |
 | Sổ cái | [/ledgers](https://steexp.com/ledgers) |
 | Thanh toán | [/payments](https://steexp.com/payments) |
 | Giao dịch | [/trades](https://steexp.com/trades) |
 | Hiệu ứng | [/effects](https://steexp.com/effects) |
 ###  Thư mục
 | Tài nguyên | URI |
 | --------------- | ------------------------------------------ |
 | Tài sản | [/assets](https://steexp.com/assets) |
 | Neo | [/anchors](https://steexp.com/anchors) |
 | Sở giao dịch | [/exchanges](https://steexp.com/exchanges) |
 | Hồ bơi lạm phát | [/pools](https://steexp.com/pools) |
 ###  Tài khoản
 | Tài nguyên | URI |
 | -------------------- | -------------------------------------------------- -------------------------------------------------- -------------------------------------------------- - |
 | theo địa chỉ Liên bang | [/account/stellar\*fed.network](https://steexp.com/account/stellar*fed.network) |
 | theo Địa chỉ công khai | [/account/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX](https://steexp.com/account/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOFOX mị) |
 ####  Tab
 | Tài nguyên | URI |
 | ---------------- | -------------------------------------------------- -------------------------------------------------- ----- |
 | Tab Cân bằng | [/account/stellar\*fed.network#balances](https://steexp.com/account/stellar*fed.network#balances) |
 | Tab Thanh toán | [/account/stellar\*fed.network#payments](https://steexp.com/account/stellar*fed.network#payments) |
 | Phiếu mua hàng | [/account/stellar\*fed.network#offers](https://steexp.com/account/stellar*fed.network#offers) |
 | Tab Hiệu ứng | [/account/stellar\*fed.network#effects](https://steexp.com/account/stellar*fed.network#effects) |
 | Tab Hoạt động | [/account/stellar\*fed.network#operations](https://steexp.com/account/stellar*fed.network#operations) |
 | Tab Giao dịch | [/account/stellar\*fed.network#transactions](https://steexp.com/account/stellar*fed.network#transactions) |
 | Tab Đăng ký | [/account/stellar\*fed.network#signs](https://steexp.com/account/stellar*fed.network#signs) |
 | Thẻ cờ | [/account/stellar\*fed.network#flags](https://steexp.com/account/stellar*fed.network#flags) |
 | Tab dữ liệu | [/account/stellar\*fed.network#data](https://steexpcom/account/stellar*fed.network#data) |

 ###  Tìm kiếm
 | Tài nguyên | URI |
 | --------------------- | -------------------------------------------------- -------------------------------------------------- -------------------------------------------------- ---------------- |
 | Địa chỉ liên kết | [/search/steexp\*fed.network](https://steexp.com/search/steexp*fed.network) |
 | Địa chỉ công cộng | [/search/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX](https://steexp.com/search/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX) |
 | Sổ cái | [/search/10000000](https://steexp.com/search/10000000) |
 | Giao dịch | [/search/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071](https://steexp.com/search/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee476707937bee) |
 | Mã tài sản | [/search/NGN](https://steexp.com/search/NGN) |
 | Tên mỏ neo | [/search/ripplefox](https://steexp.com/search/ripplefox) |
 | Tên mỏ neo (Một phần) | [/search/fox](https://steexp.com/search/fox) |

 ###  Misc

 | Tài nguyên | URI |
 | ----------- | -------------------------------------------------- -------------------------------------------------- -------------------------------------------------- -------- |
 | Giao dịch | [/tx/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071](https://steexp.com/tx/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee476707937bee) |
 | Sổ cái | [/ledger/10000000](https://steexp.com/ledger/10000000) |
 | Neo | [/anchor/apay.io](https://steexp.com/anchor/apay.io) |
 | Tài sản | [/asset/NGN](https://steexp.com/asset/NGN) |

 ##  Khám phá Mạng Phát triển Riêng / Địa phương <a name="private-networks"> </a>

 steexp sẽ kết nối với một phiên bản đường chân trời cục bộ tại http: // localhost: 8000 theo mặc định. Nếu bạn đang chạy một mạng riêng cục bộ để phát triển, điều này khá tiện lợi để duyệt các thay đổi của bạn đối với sổ cái.
 Ngoài ra, bạn có thể chạy kết nối cục bộ với testnet hoặc các trường hợp đường chân trời mạng công cộng. Để thực hiện việc này, hãy xác định các bí danh này cho localhost:
 ``
 127.0.1.1 testnet.local # cho steexp sử dụng đường chân trời testnet
 127.0.1.1 publicnet.local # cho steexp sử dụng đường chân trời mainnet
 ``
 Điều hướng đến http: //testnet.local: 3000 hoặc http: //publicnet.local: 3000 để chọn mạng mà bạn muốn khám phá.
 ##  Phát triển
 LƯU Ý: sử dụng npm thay vì sợi để cài đặt các phụ thuộc - xem [ # 15 ] (https://github.com/chatch/stellarexplorer/issues/15) để biết chi tiết
 Xem phần [ Khám phá Mạng Phát triển Riêng / Cục bộ ] (# mạng riêng) để kết nối với các mạng phụ trợ khác nhau. Theo mặc định, steexp sẽ tìm kiếm một bản sao cục bộ của đường chân trời.
 Bắt đầu:
 ``
 npm tôi && npm bắt đầu
 ``
 Bài kiểm tra:
 ``
 npm i && npm kiểm tra
 ``
 Xây dựng:
 ``
 npm i && npm run build
 ``
 ##  Ngôn ngữ
 Sử dụng bộ chọn ngôn ngữ ở góc trên cùng bên phải để thay đổi ngôn ngữ.
 Các tập tin dịch ở đây:
 https://github.com/chatch/stellarexplorer/tree/master/src/languages
 Gửi yêu cầu kéo với ngôn ngữ mới hoặc các bản sửa lỗi ngôn ngữ ở đó.

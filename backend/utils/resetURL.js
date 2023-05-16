const resetURL = (verificationToken, behavior, slug) => {
  return `<table
  border="0"
  cellpadding="20"
  cellspacing="0"
  height="100%"
  width="100%"
  id="m_-977246017001525659bodyTable"
  style="background-color: #ffffff"
>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px; border-radius: 6px; background-color: none"
          id="m_-977246017001525659templateContainer"
          class="m_-977246017001525659rounded6"
        >
          <tbody>
            <tr>
              <td align="center" valign="top">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="max-width: 600px"
                >
                  <tbody>
                    <tr>
                      <td>
                        <h1
                          style="
                            font-size: 28px;
                            line-height: 110%;
                            margin-bottom: 30px;
                            margin-top: 0;
                            padding: 0;
                          "
                        >
                          <div style="text-align: center">
                            <img
                              src="https://res.cloudinary.com/huyleminh/image/upload/v1679545822/Furniture_cczeao.png"
                              alt=""
                              border="0"
                              width="100%"
                              height="210px"
                              class="CToWUd"
                              data-bit="iit"
                            />
                          </div>
                        </h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="
                    max-width: 600px;
                    border-radius: 6px;
                    background-color: #ffffff;
                  "
                  id="m_-977246017001525659templateBody"
                  class="m_-977246017001525659rounded6"
                >
                  <tbody>
                    <tr>
                      <td
                        align="left"
                        valign="top"
                        class="m_-977246017001525659bodyContent"
                        style="
                          line-height: 150%;
                          font-family: Helvetica;
                          font-size: 14px;
                          color: #333333;
                          padding: 20px;
                        "
                      >
                        <h2
                          style="
                            font-size: 22px;
                            line-height: 28px;
                            margin: 0 0 12px 0;
                          "
                        >
                          Cám ơn bạn đã sử dụng Xomtro
                        </h2>
                        <h3
                          style="
                            font-size: 20px;
                            line-height: 26px;
                            margin: 0 0 12px 0;
                            font-style: italic;
                          "
                        >
                          <span class="il">Vui lòng ${behavior}</span> để sử dụng XomTro tốt nhất
                        </h3>
                        <a
                          class="m_-977246017001525659formEmailButton"
                          href="https://xom-tro.vercel.app/${slug}/${verificationToken}"
                          style="
                            color: #ffffff !important;
                            display: inline-block;
                            font-weight: 500;
                            font-size: 16px;
                            line-height: 42px;
                            font-family: 'Helvetica', Arial, sans-serif;
                            width: auto;
                            white-space: nowrap;
                            height: 42px;
                            margin: 12px 5px 12px 0;
                            padding: 0 22px;
                            text-decoration: none;
                            text-align: center;
                            border: 0;
                            border-radius: 3px;
                            vertical-align: top;
                            background-color: #ef4d80 !important;
                          "
                          target="_blank"
                        >
                          <span
                            style="
                              display: inline;
                              font-family: 'Helvetica', Arial, sans-serif;
                              text-decoration: none;
                              font-weight: 500;
                              font-style: normal;
                              font-size: 16px;
                              line-height: 42px;
                              border: none;
                              background-color: #ef4d80 !important;
                              color: #ffffff !important;
                              text-transform: capitalize;
                            "
                            >${behavior} ngay.</span
                          >
                        </a>
                        <br />
                        <div>
                          <p style="padding: 0 0 10px 0">
                          Hãy click vào link ở trên để ${behavior} tài khoản của bạn trong 10 phút. Vui lòng liên
                           hệ quản trị viên nếu có bất kỳ lỗi nào trong quá trình ${behavior}. Xin cảm ơn!
                          </p>
                        </div>
                        <span>
                          <span
                            content="We need to ${behavior} your account."
                          ></span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
};

module.exports = resetURL;

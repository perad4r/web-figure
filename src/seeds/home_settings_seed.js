const items = [
  {
    section: 'hero_banner',
    position: 0,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5Y0xqxTyYNTMJl_7Lv21kN1TCdrxwISRMGAb2CSLPU22g22976QOSh4sTnF85M8Xf6zV3MNIIVZuRAfGLSf8blZjlUFgQogfffoFIE8aSyYRUH-5B0Nu9BLJQd-4SRbgenqGrpidinNjbbOMcOVeu9bjpW4-Zj8e6PCASVyTJeYbjDrQtPCOHofINpaKACI0vrDEk6Q_shh-kE7qrwwiGG4gdVmIAYbKmL8XC1mvj3I1hI3_bAhb7T4aavLaVJKZ9k8J5JSNki4WT',
  },
  {
    section: 'promo_card',
    position: 0,
    label: 'Pre-Orders Open',
    subtitle: 'Secure yours now →',
    link_url: '/san-pham',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGqbMrzDp-R0e7m8mj8ZCf0_CvxSTppEgWHAvUU5nD9SKm6EpekL2R4K99yC9CGk5e1dxYGv7vXNu3dG7B4xaHnaJLEwj6LRRGvkMujBgOaHk4qet6cQzgnfHIgarB-kuJm_4QxjcUW2QXqYglpL2SWFYfpF4fezDgDDU4lHKOZBUN4RBdCQMh1bLby4JI5eSQGPur33rFbfzCA1dLxhitNqfdD1cr8YJcBw1LbIdDIpozKlJOQ5kP_IaL8I2vMMS5LNX3GBjn7pN-',
  },
  {
    section: 'promo_card',
    position: 1,
    label: 'New Arrivals',
    subtitle: 'Shop latest collections →',
    link_url: '/san-pham',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGUxEd3e3KGGq2OiDfTl-Yag6slW891ds0ms_xmqy35wRndZ47YSFFgM_B33xtSRs0O1rcdtasLD04qphxlbl0kQ0Mq8RWFZEtAigIplPx0Hk9vJA9oauLc1q0AliTpO-9rA2dDPpH_MywZV4z3XN3RskauPp4-idAyZDE1Ux1KJ9x_oXaA2f4p9ziP67uoOC9MZRW2jQPzF_yy6BPU5PveJ4PREFo2sKSxiZvEHw3kFdd8fX21f133realcZXcfvWs0ZgIG9bt_Qw',
  },
  {
    section: 'brand_logo',
    position: 0,
    label: 'Good Smile Company',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKL_cYjcHrlNXX13vJX-dQBOkGAx6PAxVq95I55i5aTW_2MycUnTFoLz2x2LFIYXrmDMMFbi-NB7R1BFjGDVqrl5RB1AE3LkPnTNXb4p7vC9SUrGUTJJ7QJxZnE_c-k82ydQ0NOqmEc0_vlHhxWF8ZjcJ8-QkOCngFBZtAbqNI3y3h5AHjilKfiWqJB0inJwK4yflZRtb6w7Vmcp8r4cwIqSzgo5wGercdmIfI4prW2zzUzdSdhz8-6-jPgOwhK4LPxJl9_qbIgbpI',
  },
  {
    section: 'brand_logo',
    position: 1,
    label: 'Max Factory',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7RwEzyljI_1ZQfIyYYOs_2dGfzgtw4giomUr0SSRhWACroKLgQejAW7tTCJEhaEtaozmRujmd1URpSnwnfhvtInig8y87A5NuXGNWapt5VFQq64pygC3pPwCsmVIZXC_stCR38-QQvvWY8c3otXO79lZY-4rO24KC3e6J0XkScDXkpDUBNbeNNSZFkNoeLDG6FUdZroZhJy0_l3Yg7jUPRZtvREesErJsXJBiuB0veSA23PUxckskXuTDEuUwotBl9tvwH4T7nK0',
  },
  {
    section: 'brand_logo',
    position: 2,
    label: 'Kotobukiya',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBmnHfaimWe_AsW3ESdStWk7qzeemkF0Eji197pU7PUlFGDkVm71RjtwI2URvU8fOM1srPxLlGlDxlqywzBQq65voRN2arsqAhKCKC82kFUjMf-nj1o0fMcqT56SW2M69x0O0MBoqYyviS1dFNC-_i8XXdYZaDbaokgMdXOeBVnL8JkGPvvQVn8WFzibFm7lvUXK6ixZDkNe6tS2JvE0HQEnlZu8HD_CJ37JaKf2vj3zBiMII2DlHYS5QNErB5HF_ew4LoRQIFuCpj',
  },
  {
    section: 'brand_logo',
    position: 3,
    label: 'FuRyu',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBo0hxKZJZqGNAYHoE24lSSMNFPQq_0t13Il67-h5BQK9PmjwvBHj6MTyvhKejHcQoVXuHlNOnHBfoORgkCt-0lzHYhTImJE2zubAby16tEU_5g74uUJ84A9wYns2DhOOYz_ojbg9FBuqbKq8v5cUsUd1YWsVECD24Z9iRSaw1eToNplp9EthgvD0nELj_Y0Phlcw1Ov3QTibaGBOGvuzq9eQPG7zWGH40i63ap_6FIuOJ-xdf4YrDegU-RV_aQ8ps1_5or0omghGq',
  },
  {
    section: 'testimonial',
    position: 0,
    label: 'Akashi Chowie',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMiwu9iBLXplNRfY3Wr2AnMGy46on6ddxCXRXInYLVJkVp-W9hNSH78kzee0pZD7g5dqaxqL9Hz7mRC5jQnh0eOREkkeFf_FHs3jzXEUn8kKtAwFBynfiD8RT38nfLcMtp3YsbLfIMJh-zUyetM8GorCZVVhutZuMZrm_3X_zyhbNfv4JZhNeaHbK53kvon-JjIT5puK7KwOUTwMnP3kYZsat-u6BvHawIZgxYokYgaV0-XPsVUL30BlEi83Jsz2hH13zbnamseuV',
    extra_json: JSON.stringify({ comment: 'Quán cuti zì, á, tỉ lệ 100% có gấu nha 😍 hjhj' }),
  },
  {
    section: 'testimonial',
    position: 1,
    label: 'Hoaii Anh',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsOtPEMCbLxnN5gGSJu6LZjGlOHZjSHcHzSAPctSk28PfCb6ekUVPYlYXB2DlP06TVhzTKaKrHLLy9a3T1l6xcDU4_FDY2oZLm-bdKqKzcAsaFfccU4Z1JqyXZi0H9513E35NKiZbsihsc8jI5oUAhqLDUmYtB_-npEKBXYkf11JGxAQLcxPCcYmp7bu3_2hs1mSHRr5FXWfGQkEkYVf85HCL1w2tYCvRAkBv_llizY9huj0LPoEK-0NSC3QXcRSrKdD3k8vR14Rc',
    extra_json: JSON.stringify({ comment: 'anh chủ nhiệt tình vch đến là có gấu nựng đến ủng hộ đi' }),
  },
  {
    section: 'testimonial',
    position: 2,
    label: 'Kim Juure',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMjL9_BXODSGpfWjV4y5Zzu5TARe-_73igkHZy98UERMs75bysFaerjM94p-bRin75pZjcuHICB3LI82-uqKGa7gjAgRN8If_8YpQXXJiAtocxs3JJgyqeaUMXT8_77jtccCC1OTqYHfOUyEZxkmuzLask4WY_i9RLqGIiuksuNSvZFAhXgaLDVNcCCwlqaRND_Gs1ombkIkU_y6ELnPrp3j3B5rSpOQhdcZhHhnDI9k8vRrOCMgAh1LM5oXx7G6OqIpUHhW6ShRfeyG',
    extra_json: JSON.stringify({ comment: 'Gấu bông bên này siêu dễ thương, recommend mọi người qua mua nha' }),
  },
  {
    section: 'gallery_image',
    position: 0,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMiwu9iBLXplNRfY3Wr2AnMGy46on6ddxCXRXInYLVJkVp-W9hNSH78kzee0pZD7g5dqaxqL9Hz7mRC5jQnh0eOREkkeFf_FHs3jzXEUn8kKtAwFBynfiD8RT38nfLcMtp3YsbLfIMJh-zUyetM8GorCZVVhutZuMZrm_3X_zyhbNfv4JZhNeaHbK53kvon-JjIT5puK7KwOUTwMnP3kYZsat-u6BvHawIZgxYokYgaV0-XPsVUL30BlEi83Jsz2hH13zbnamseuV',
  },
  {
    section: 'gallery_image',
    position: 1,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsOtPEMCbLxnN5gGSJu6LZjGlOHZjSHcHzSAPctSk28PfCb6ekUVPYlYXB2DlP06TVhzTKaKrHLLy9a3T1l6xcDU4_FDY2oZLm-bdKqKzcAsaFfccU4Z1JqyXZi0H9513E35NKiZbsihsc8jI5oUAhqLDUmYtB_-npEKBXYkf11JGxAQLcxPCcYmp7bu3_2hs1mSHRr5FXWfGQkEkYVf85HCL1w2tYCvRAkBv_llizY9huj0LPoEK-0NSC3QXcRSrKdD3k8vR14Rc',
  },
  {
    section: 'gallery_image',
    position: 2,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMjL9_BXODSGpfWjV4y5Zzu5TARe-_73igkHZy98UERMs75bysFaerjM94p-bRin75pZjcuHICB3LI82-uqKGa7gjAgRN8If_8YpQXXJiAtocxs3JJgyqeaUMXT8_77jtccCC1OTqYHfOUyEZxkmuzLask4WY_i9RLqGIiuksuNSvZFAhXgaLDVNcCCwlqaRND_Gs1ombkIkU_y6ELnPrp3j3B5rSpOQhdcZhHhnDI9k8rOCMgAh1LM5oXx7G6OqIpUHhW6ShRfeyG',
  },
  {
    section: 'gallery_image',
    position: 3,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4kcn3wqbKk7Z_e1XfcbvKacWFNp9Hwc12D2ZS1q8Ggyf5-8Yk1yplj4DVpCsy24mCiPpS-928G_vq-ikVPgbEOWY8noFmylo9YCW0qSi_yALFVE0PW8SB-e6z0HAK0iWGugynskAIgV5M8j1s9BPdUcF7qsHWicn28FdnJElvhgd7zQeQ5st2PQaFjmV-VXbeIJK75ZRhW7KjLDmJ0CpBrIYypvUpMn0I8vVrfEYJVAQ5LMwWxGkfE7OGeKOFBgGXoDPt-7qxnGpn',
  },
];

exports.seed = async function seed(knex) {
  const countRow = await knex('home_settings').count({ c: '*' }).first();
  const count = Number(countRow?.c ?? Object.values(countRow || {})[0] ?? 0);
  if (count > 0) return;

  await knex('home_settings').insert(items);
};

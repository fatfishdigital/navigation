/**
 * Navigation plugin for Craft CMS
 *
 * Navigation JS
 *
 * @author    Fatfish
 * @copyright Copyright (c) 2018 Fatfish
 * @link      https://fatfish.com.au
 * @package   Navigation
 * @since     1.0.0
 */
$(document).ready(function () {

    $tabledata = $('.sortable');
    $btnSave = $('#savemenu');
    $formElement = $('#form_element').html();
    $CreateMenu = $('#create_menu').html();
    $menuname = $('#menuname');
    $btnCustomUrl = $('#customPage');


    $('#addpage').on('click', function () {

        new Craft.BaseElementSelectorModal('craft\\elements\\Entry', {
            onSelect: function (element) {

                $tabledata.append(
                    '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_' + element[0].id + '" title="' + element[0].label + '" data-url="'+element[0].url+'">' +
                    '<div class="menuDiv">' +
                    '<span class="menulabel">' + element[0].label +
                    '</span>' +
                    '&nbsp;<a class="delete icon deletenode" title="delete" role="button" onclick="removeMenuNode($(this));" id="menuItem_' + element[0].id + '">' +   '&nbsp;<a class="settings icon menusettings" title="setting" role="button" id="menuItem_' + element[0].id + '" onclick="updateNode($(this))">' +
                    '</a>' +
                    '</div> ' +
                    '</li>'
                );

            },
            multiSelect: true
        });

    });

    $btnSave.on('click', function () {
        if($('#menuname').val()==="")
        {
          Craft.cp.displayNotification('error',"Cannot Save Empty Menu !!!");
            return;
        }
        else if(!$('ol').children().length>0)
        {
           Craft.cp.displayNotification('error','You dont have any menu item in the list');
           return;
        }
        else{}
        var $postData = [{menuname:$('#menuname').val(),siteId:Craft.siteId}];
        var $SerializedMenu = $('ol.sortable').nestedSortable('toArray');
        var $id= $('#menuid').val();
        var $htmlmenu=$.trim($('#navigation-menu').html());
         Craft.postActionRequest('/navigation/save',{menuname:$postData,menuArray:$SerializedMenu,id:$id,menuhtml:$htmlmenu},function (response, status) {
           if(response==1)
           {
               Craft.cp.displayNotice('Menu Saved');
           }
           else
           {
               Craft.cp.displayAlerts('Error on Saving Menu');
           }
        });
    });

    $btnCustomUrl.on('click', function (e) {


        $formBody = $('<div class="modal fitted"/>');

        $($formElement).appendTo($formBody);

        $modal = new Garnish.Modal($formBody, {
            onShow: function () {
                $CustomButton = $('#BtnCustomUrl');
                $CustomButton.on('click', function () {
                    $randomId = Math.floor((Math.random() * 100) + 1);
                    $tabledata.append(
                        '<li style="display: list-item;" class="mjs-nestedSortable-branch mjs-nestedSortable-expanded" id="menuItem_' + $randomId + '" data-url="' + $('#url').val() + '">' +
                        '<div class="menuDiv">' +
                        '<span>' + $('#name').val() +
                        '</span>' +
                        '&nbsp;<a class="delete icon" title="delete" role="button" id="menuItem_' + $randomId + '" >' +
                        '</a>' +
                        '</div> ' +
                        '</li>'
                    );

                    $modal.hide();
                    $modal.destroy();
                });
            }


        });

    });


    $('#NewMenu').on('click', function () {
        $modal = $('<div class="modal fitted"/>');
        $($CreateMenu).appendTo($modal);
        $modal = new Garnish.Modal($modal, {
            onShow: function () {
                $('#MenuBtn').on('click', function () {
                    $('.namelabel').html($('#name').val());
                    $menuname.val($('#name').val());
                    $modal.hide();
                    $modal.destroy();
                });
            },
            onHide: function () {
                $modal.destroy();
            }
        });
    });

    /*
    Delete Menu and its Submenu
     */

$('.DeleteNav').on('click',function () {
   var $MenuName = $(this).data('title');
   $deleteModal = $('<div class="modal fitted"/>');
    var $ModalBody = $('#DeleteMenu').html();
    $deleteModal.append($ModalBody);
   var $modal=new Garnish.Modal($deleteModal,{
        onShow : function () {
            $('#MenuBtn').on('click',function () {
              var $id = $('.DeleteNav').data('id');
              Craft.postActionRequest('/navigation/delete',{id:$id},function (response) {
                  if(response)
                  {
                      Craft.cp.displayNotice("Menu Deleted Successfully !!");
                      location.reload();
                  }
                  else {
                      Craft.cp.displayNotice("Cannot Delete Menu !");
                      location.reload();
                  }
              });
              $modal.hide();
              $modal.destroy();
            });
        },
       onHide: function () {
           $modal.destroy();

       }

   });

});


});
function removeMenuNode($this) {
    $id='#'+$this.attr('id');
    $($id).remove();
}

/*
    when any node is updated this will change the value of each updated node.
 */
function updateNode($this)
{


    $id = '#'+$($this).attr('id');
    $menuname = $($id).find('div').find('span').html();
    $url = $($id).data('url');

    $formBody = $('<div class="modal fitted"/>');
    $($formElement).appendTo($formBody);
    $modal = new Garnish.Modal($formBody, {
        onShow: function () {

            $('#name').val($menuname);
            $('#url').val($url);
           var $CustomButton = $('#BtnCustomUrl');
            $CustomButton.on('click', function () {
               $($id).find('div').find('span').html($('#name').val());
               $($id).attr('title',$('#name').val());
               $($id).attr('url',$('#url').val());
               $modal.hide();
               $modal.destroy();
            });
        },
        onHide:function () {
            $modal.destroy();
        }


    });

}
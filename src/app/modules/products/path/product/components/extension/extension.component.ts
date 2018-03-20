import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ProductService } from '../../product.service';
import { FormService } from '@services/form.service';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-product-extension',
    templateUrl: './extension.component.html',
    styleUrls: ['./extension.component.less'],
    providers: [FormService]
  })

export class ProductExtensionComponent {
  private products = <any>[];
  private selectedId: number;
  private _showUpdate = false;
  private subscription: Subscription;
  private form=new FormGroup({});
  private _show:boolean;
  private _productId:number;


  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor(
    private productService: ProductService,
    private formService:FormService
  ) {
  }

  @Input()
  get show() {
    return this._show;
  }

  set show(isShow) {
    this._show = isShow;
  }

  get formReady(): boolean { return !!Object.keys(this.form.controls).length; }

  get productExtendItemList():FormArray{return this.form.get('productExtendItemList') as FormArray;}

  handleClose() {
    this.onClose.emit();
  }

  @Input()
  set productId(productId){
    this._productId = productId;
    if(this.show){
        this.productService.productExtensions(productId).subscribe(data=>{            
            this.form = this.formService.createForm(data);
        });
    }    
  }
 
  get productId(){
      return this._productId;
  }
}

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserDetailPageComponent} from './user-detail-page.component';

describe('UserDetailPageComponent', () => {
    let component: UserDetailPageComponent;
    let fixture: ComponentFixture<UserDetailPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserDetailPageComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDetailPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
